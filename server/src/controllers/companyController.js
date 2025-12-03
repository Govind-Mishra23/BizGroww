const CompanyProfile = require('../models/CompanyProfile');
const User = require('../models/User');
const Requirement = require('../models/Requirement');

// @desc    Get company profile
// @route   GET /api/company
// @access  Protected
const getCompanyProfile = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            console.error('❌ No user found in request');
            return res.status(401).json({ message: 'Not authorized' });
        }

        console.log('🔍 Fetching profile for User ID:', req.user._id.toString());
        console.log('👤 User Email:', req.user.email);
        console.log('🎭 User Role:', req.user.role);
        
        const profile = await CompanyProfile.findOne({ user: req.user._id });
        
        if (profile) {
            console.log('✅ Profile found for user:', req.user.email);
            console.log('📄 Profile ID:', profile._id.toString());
            console.log('🏢 Company Name:', profile.companyName || '(empty)');
            
            // Return profile with user ID for verification
            res.json({
                ...profile.toObject(),
                _userId: req.user._id.toString(),
                _userEmail: req.user.email
            });
        } else {
            console.log('⚠️ No profile found for user:', req.user.email);
            res.status(404).json({ message: 'Company profile not found' });
        }
    } catch (error) {
        console.error('❌ Error fetching profile:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create or Update company profile
// @route   POST /api/company
// @access  Protected
const createOrUpdateProfile = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            console.error('❌ No user found in request');
            return res.status(401).json({ message: 'Not authorized' });
        }

        console.log('💾 Saving profile for User ID:', req.user._id.toString());
        console.log('👤 User Email:', req.user.email);
        
        const {
            companyName, industry, businessModel, companyType, incorporationYear,
            gstNumber, ownerName, otherDirectors, contactNumber, email, website,
            headOffice, manufacturingUnit, branches,
            products, gallery, certificates,
            geographicCoverage, networkDetails
        } = req.body;

        let profile = await CompanyProfile.findOne({ user: req.user._id });

        if (profile) {
            // Update existing profile - only update fields that are provided
            if (companyName !== undefined) profile.companyName = companyName;
            if (industry !== undefined) profile.industry = industry;
            if (businessModel !== undefined) profile.businessModel = businessModel;
            if (companyType !== undefined) profile.companyType = companyType;
            if (incorporationYear !== undefined) profile.incorporationYear = incorporationYear;
            if (gstNumber !== undefined) profile.gstNumber = gstNumber;
            if (ownerName !== undefined) profile.ownerName = ownerName;
            if (otherDirectors !== undefined) profile.otherDirectors = otherDirectors;
            if (website !== undefined) profile.website = website;
            if (email !== undefined) profile.email = email;
            if (contactNumber !== undefined) profile.contactNumber = contactNumber;

            if (headOffice !== undefined) profile.headOffice = headOffice;
            if (manufacturingUnit !== undefined) profile.manufacturingUnit = manufacturingUnit;
            if (branches !== undefined) profile.branches = branches;

            if (products !== undefined) profile.products = products;
            if (gallery !== undefined) profile.gallery = gallery;
            if (certificates !== undefined) profile.certificates = certificates;

            if (geographicCoverage !== undefined) profile.geographicCoverage = geographicCoverage;
            if (networkDetails !== undefined) profile.networkDetails = networkDetails;

            const updatedProfile = await profile.save();
            console.log('✅ Company Profile Updated Successfully for:', req.user.email);
            console.log('🏢 Updated Company Name:', updatedProfile.companyName);
            
            // Return with user verification data
            return res.json({
                ...updatedProfile.toObject(),
                _userId: req.user._id.toString(),
                _userEmail: req.user.email
            });
        } else {
            // Profile should exist from registration, but create if missing
            profile = new CompanyProfile({
                user: req.user._id,
                companyName: companyName || '',
                industry: industry || '',
                businessModel: businessModel || [],
                companyType: companyType || 'Proprietor',
                incorporationYear: incorporationYear || '',
                gstNumber: gstNumber || '',
                ownerName: ownerName || '',
                otherDirectors: otherDirectors || [],
                contactNumber: contactNumber || '',
                email: email || '',
                website: website || '',
                headOffice: headOffice || { country: 'India', state: '', town: '', address: '' },
                manufacturingUnit: manufacturingUnit || { country: 'India', state: '', town: '', address: '' },
                branches: branches || [],
                products: products || [],
                gallery: gallery || { factory: [], machinery: [], offices: [], warehouse: [], products: [], events: [] },
                certificates: certificates || { gst: '', iso: '', msme: '', importLicense: '', compliance: [] },
                geographicCoverage: geographicCoverage || { country: 'India', states: [] },
                networkDetails: networkDetails || { distributorNetwork: '', influencerNetwork: '' }
            });

            const createdProfile = await profile.save();
            console.log('✅ New Company Profile Created Successfully for:', req.user.email);
            console.log('📄 Profile ID:', createdProfile._id.toString());
            
            // Return with user verification data
            return res.status(201).json({
                ...createdProfile.toObject(),
                _userId: req.user._id.toString(),
                _userEmail: req.user.email
            });
        }
    } catch (error) {
        console.error('❌ Error saving profile:', error.message);
        console.error('Request Body:', JSON.stringify(req.body, null, 2));
        res.status(400).json({ message: error.message, details: error.errors });
    }
};

// @desc    Get all company profiles (for admin)
// @route   GET /api/company/all
// @access  Admin
const getAllCompanyProfiles = async (req, res) => {
    try {
        const profiles = await CompanyProfile.find().sort({ createdAt: -1 });
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update company profile status
// @route   PATCH /api/company/:id/status
// @access  Admin
const updateCompanyStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'underReview', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const profile = await CompanyProfile.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({ message: 'Company profile not found' });
        }

        console.log(`✅ Company Status Updated: ${profile.companyName} -> ${status}`);
        res.json(profile);
    } catch (error) {
        console.error('❌ Error updating status:', error.message);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete company profile and all associated data
// @route   DELETE /api/company/:id
// @access  Admin
const deleteCompanyProfile = async (req, res) => {
    try {
        const profile = await CompanyProfile.findById(req.params.id);

        if (!profile) {
            return res.status(404).json({ message: 'Company profile not found' });
        }

        // 1. Delete associated User
        if (profile.user) {
            await User.findByIdAndDelete(profile.user);
        }

        // 2. Delete associated Requirements
        await Requirement.deleteMany({ company: profile._id });

        // 3. Delete the Profile itself
        await CompanyProfile.findByIdAndDelete(req.params.id);

        console.log(`✅ Company Deleted: ${profile.companyName} (and associated user/requirements)`);
        res.json({ message: 'Company and all associated data removed' });
    } catch (error) {
        console.error('❌ Error deleting company:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all distributors (for manufacturers to view)
// @route   GET /api/company/distributors
// @access  Protected (Manufacturer only)
const getDistributors = async (req, res) => {
    try {
        console.log('🔍 Fetching all distributors for manufacturer:', req.user.email);
        
        // Find all users with role 'distributor'
        const distributorUsers = await User.find({ role: 'distributor' }).select('_id email name');
        
        if (distributorUsers.length === 0) {
            console.log('⚠️ No distributors found');
            return res.json([]);
        }
        
        // Get their profiles
        const distributorIds = distributorUsers.map(u => u._id);
        const profiles = await CompanyProfile.find({ 
            user: { $in: distributorIds },
            companyName: { $ne: '' } // Only show profiles with company name filled
        }).populate('user', 'name email');
        
        console.log(`✅ Found ${profiles.length} distributor profiles`);
        
        res.json(profiles);
    } catch (error) {
        console.error('❌ Error fetching distributors:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all retailers (for manufacturers to view)
// @route   GET /api/company/retailers
// @access  Protected (Manufacturer only)
const getRetailers = async (req, res) => {
    try {
        console.log('🔍 Fetching all retailers for manufacturer:', req.user.email);
        
        // Find all users with role 'retailer'
        const retailerUsers = await User.find({ role: 'retailer' }).select('_id email name');
        
        if (retailerUsers.length === 0) {
            console.log('⚠️ No retailers found');
            return res.json([]);
        }
        
        // Get their profiles
        const retailerIds = retailerUsers.map(u => u._id);
        const profiles = await CompanyProfile.find({ 
            user: { $in: retailerIds },
            companyName: { $ne: '' } // Only show profiles with company name filled
        }).populate('user', 'name email');
        
        console.log(`✅ Found ${profiles.length} retailer profiles`);
        
        res.json(profiles);
    } catch (error) {
        console.error('❌ Error fetching retailers:', error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getCompanyProfile, 
    createOrUpdateProfile, 
    getAllCompanyProfiles, 
    updateCompanyStatus,
    deleteCompanyProfile,
    getDistributors,
    getRetailers
};
