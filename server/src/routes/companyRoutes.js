const express = require('express');
const router = express.Router();
const { 
    getCompanyProfile, 
    createOrUpdateProfile, 
    getAllCompanyProfiles, 
    updateCompanyStatus,
    deleteCompanyProfile,
    getDistributors,
    getRetailers
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protected routes - only manufacturer, distributor, retailer can manage their profiles
router.route('/')
    .get(protect, authorize('manufacturer', 'distributor', 'retailer'), getCompanyProfile)
    .post(protect, authorize('manufacturer', 'distributor', 'retailer'), createOrUpdateProfile);

// Manufacturer can view distributors and retailers
router.route('/distributors').get(protect, authorize('manufacturer'), getDistributors);
router.route('/retailers').get(protect, authorize('manufacturer'), getRetailers);

// Admin routes - for monitoring
router.route('/all').get(getAllCompanyProfiles);
router.route('/:id/status').patch(updateCompanyStatus);
router.route('/:id').delete(deleteCompanyProfile);

module.exports = router;
