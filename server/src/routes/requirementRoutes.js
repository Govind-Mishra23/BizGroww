const express = require('express');
const router = express.Router();
const {
    getRequirements,
    getRequirementById,
    createRequirement,
    updateRequirement,
    deleteRequirement,
    fixRequirementsWithoutCompany,
    getMyRequirements
} = require('../controllers/requirementController');
const { protect, extractUser, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getRequirements); // Public - for admin to see all

// Protected routes - require authentication
router.get('/my-requirements', protect, authorize('manufacturer'), getMyRequirements); // Only manufacturers can see their requirements

router.get('/:id', getRequirementById); // Public - for viewing

// Migration route - must be before other POST routes
router.post('/fix-company', fixRequirementsWithoutCompany);

// Protected routes - only manufacturers can create/update/delete requirements
router.post('/', protect, authorize('manufacturer'), createRequirement);

// Allow public access for admin panel (uses extractUser to check if logged in, but allows if not)
router.put('/:id', extractUser, updateRequirement);
router.delete('/:id', extractUser, deleteRequirement);

module.exports = router;
