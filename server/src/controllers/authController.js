const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const CompanyProfile = require('../models/CompanyProfile');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    console.log('📝 Registration attempt:', { name, email, role });

    const userExists = await User.findOne({ email });

    if (userExists) {
        console.log(`❌ Registration failed: Email ${email} already exists as ${userExists.role}`);
        res.status(400);
        throw new Error(`User already exists with this email as a ${userExists.role}`);
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    if (user) {
        console.log(`✅ User created: ${email} | Role: ${role} | ID: ${user._id}`);
        
        // Create empty CompanyProfile for roles that need it
        const rolesWithProfile = ['manufacturer', 'distributor', 'retailer'];
        
        if (rolesWithProfile.includes(role)) {
            try {
                await CompanyProfile.create({
                    user: user._id,
                    companyName: '',
                    industry: '',
                    businessModel: [],
                    companyType: 'Proprietor',
                    incorporationYear: '',
                    gstNumber: '',
                    ownerName: name,
                    contactNumber: '',
                    email: email,
                    website: '',
                    headOffice: {
                        country: 'India',
                        state: '',
                        town: '',
                        address: ''
                    },
                    manufacturingUnit: {
                        country: 'India',
                        state: '',
                        town: '',
                        address: ''
                    },
                    branches: [],
                    products: [],
                    gallery: {
                        factory: [],
                        machinery: [],
                        offices: [],
                        warehouse: [],
                        products: [],
                        events: []
                    },
                    certificates: {
                        gst: '',
                        iso: '',
                        msme: '',
                        importLicense: '',
                        compliance: []
                    },
                    status: 'pending'
                });
                console.log(`✅ Empty CompanyProfile created for user: ${email}`);
            } catch (profileError) {
                console.error('⚠️ Failed to create profile:', profileError.message);
                // Don't fail registration if profile creation fails
            }
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    console.log('🔐 Login attempt for:', email, '| Selected role:', role || '(none)');

    const user = await User.findOne({ email });

    if (!user) {
        console.log('❌ User not found:', email);
        res.status(401);
        throw new Error('Invalid email or password');
    }

    // Verify password
    const passwordMatch = await user.matchPassword(password);
    if (!passwordMatch) {
        console.log('❌ Invalid password for:', email);
        res.status(401);
        throw new Error('Invalid email or password');
    }

    // CRITICAL: Verify role matches
    if (role && user.role !== role) {
        console.log(`❌ ROLE MISMATCH: User ${email} is registered as ${user.role}, but trying to login as ${role}`);
        res.status(403);
        throw new Error(`Access denied. This account is registered as a ${user.role}, not ${role}. Please select the correct role or use a different account.`);
    }

    console.log(`✅ Login successful: ${email} | Role: ${user.role}`);

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
    });
});

module.exports = { registerUser, authUser };
