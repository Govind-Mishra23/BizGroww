const Requirement = require('../models/Requirement');

// @desc    Get all requirements
// @route   GET /api/requirements
// @access  Public
const getRequirements = async (req, res) => {
    try {
        const requirements = await Requirement.find()
            .populate('company', 'companyName ownerName email contactNumber gstNumber headOffice')
            .sort({ createdAt: -1 });
        res.json(requirements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get requirements for the logged-in manufacturer
// @route   GET /api/requirements/my-requirements
// @access  Private
const getMyRequirements = async (req, res) => {
    try {
        // console.log('getMyRequirements called for user:', req.user?._id);
        const CompanyProfile = require('../models/CompanyProfile');

        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const companyProfile = await CompanyProfile.findOne({ user: req.user._id });

        if (!companyProfile) {
            console.log('Company profile not found for user:', req.user._id);
            return res.status(404).json({ message: 'Company profile not found' });
        }

        const requirements = await Requirement.find({ company: companyProfile._id })
            .populate('company', 'companyName ownerName email contactNumber gstNumber headOffice')
            .sort({ createdAt: -1 });

        res.json(requirements);
    } catch (error) {
        console.error('Error in getMyRequirements:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single requirement
// @route   GET /api/requirements/:id
// @access  Public
const getRequirementById = async (req, res) => {
    try {
        const requirement = await Requirement.findById(req.params.id)
            .populate('company', 'companyName ownerName email contactNumber gstNumber headOffice');
        if (requirement) {
            res.json(requirement);
        } else {
            res.status(404).json({ message: 'Requirement not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Create a requirement
// @route   POST /api/requirements
// @access  Private (requires authentication)
const createRequirement = async (req, res) => {
    try {
        const CompanyProfile = require('../models/CompanyProfile');

        // Get the company profile for the authenticated user
        const companyProfile = await CompanyProfile.findOne({ user: req.user._id });

        if (!companyProfile) {
            return res.status(404).json({
                message: 'Company profile not found. Please complete your company profile first.'
            });
        }

        const {
            title, targetAudience, states, towns,
            marketingSupport, supportOptions, notes, status
        } = req.body;

        const requirement = new Requirement({
            title,
            targetAudience,
            states,
            towns,
            marketingSupport,
            supportOptions,
            notes,
            status,
            company: companyProfile._id // Automatically set from authenticated user's company
        });

        const createdRequirement = await requirement.save();

        // Populate company data before sending response
        await createdRequirement.populate('company', 'companyName ownerName email contactNumber');

        console.log('✅ New Requirement Posted Successfully:', createdRequirement.reqId);
        res.status(201).json(createdRequirement);
    } catch (error) {
        console.error('❌ Error creating requirement:', error.message);
        console.error('Request Body:', req.body);
        res.status(400).json({ message: error.message, details: error.errors });
    }
};

// @desc    Update a requirement
// @route   PUT /api/requirements/:id
// @access  Public/Private
const updateRequirement = async (req, res) => {
    try {
        const CompanyProfile = require('../models/CompanyProfile');

        const requirement = await Requirement.findById(req.params.id);

        if (!requirement) {
            return res.status(404).json({ message: 'Requirement not found' });
        }

        // Allow Admin OR Unauthenticated User (Admin Panel) to bypass ownership check
        // If req.user exists, check if they are NOT admin
        if (req.user && req.user.role !== 'admin') {
            // Get the company profile for the authenticated user
            const companyProfile = await CompanyProfile.findOne({ user: req.user._id });

            if (!companyProfile) {
                return res.status(404).json({
                    message: 'Company profile not found.'
                });
            }

            // Check if the requirement belongs to the authenticated user's company
            if (requirement.company.toString() !== companyProfile._id.toString()) {
                return res.status(403).json({
                    message: 'Not authorized to update this requirement'
                });
            }
        }

        requirement.title = req.body.title || requirement.title;
        requirement.targetAudience = req.body.targetAudience || requirement.targetAudience;
        requirement.states = req.body.states || requirement.states;
        requirement.towns = req.body.towns || requirement.towns;
        requirement.marketingSupport = req.body.marketingSupport ?? requirement.marketingSupport;
        requirement.supportOptions = req.body.supportOptions || requirement.supportOptions;
        requirement.notes = req.body.notes || requirement.notes;
        requirement.status = req.body.status || requirement.status;

        const updatedRequirement = await requirement.save();
        await updatedRequirement.populate('company', 'companyName ownerName email contactNumber');

        console.log('✅ Requirement Updated:', updatedRequirement.reqId);
        res.json(updatedRequirement);
    } catch (error) {
        console.error('❌ Error updating requirement:', error.message);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a requirement
// @route   DELETE /api/requirements/:id
// @access  Public/Private
const deleteRequirement = async (req, res) => {
    try {
        const CompanyProfile = require('../models/CompanyProfile');

        const requirement = await Requirement.findById(req.params.id);

        if (!requirement) {
            return res.status(404).json({ message: 'Requirement not found' });
        }

        // Allow Admin OR Unauthenticated User (Admin Panel) to bypass ownership check
        // If req.user exists, check if they are NOT admin
        if (req.user && req.user.role !== 'admin') {
            // Get the company profile for the authenticated user
            const companyProfile = await CompanyProfile.findOne({ user: req.user._id });

            if (!companyProfile) {
                return res.status(404).json({
                    message: 'Company profile not found.'
                });
            }

            // Check if the requirement belongs to the authenticated user's company
            // Handle case where requirement.company might be populated or just an ID
            const requirementCompanyId = requirement.company._id ? requirement.company._id.toString() : requirement.company.toString();

            if (requirementCompanyId !== companyProfile._id.toString()) {
                return res.status(403).json({
                    message: 'Not authorized to delete this requirement'
                });
            }
        }

        await requirement.deleteOne();
        console.log('✅ Requirement Deleted:', requirement.reqId);
        res.json({ message: 'Requirement removed' });
    } catch (error) {
        console.error('❌ Error deleting requirement:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fix requirements without company data (migration)
// @route   POST /api/requirements/fix-company
// @access  Admin
const fixRequirementsWithoutCompany = async (req, res) => {
    try {
        const CompanyProfile = require('../models/CompanyProfile');

        // Get the first company (assuming single company for now)
        const company = await CompanyProfile.findOne();

        if (!company) {
            return res.status(404).json({ message: 'No company profile found' });
        }

        // Find all requirements without company
        const requirementsWithoutCompany = await Requirement.find({
            $or: [
                { company: { $exists: false } },
                { company: null }
            ]
        });

        // Update them with the company ID
        const updatePromises = requirementsWithoutCompany.map(req => {
            req.company = company._id;
            return req.save();
        });

        await Promise.all(updatePromises);

        console.log(`✅ Fixed ${requirementsWithoutCompany.length} requirements without company data`);
        res.json({
            message: `Fixed ${requirementsWithoutCompany.length} requirements`,
            fixed: requirementsWithoutCompany.length
        });
    } catch (error) {
        console.error('❌ Error fixing requirements:', error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getRequirements,
    getRequirementById,
    createRequirement,
    updateRequirement,
    deleteRequirement,
    fixRequirementsWithoutCompany,
    getMyRequirements
};
