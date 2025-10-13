const express = require('express');
const router = express.Router();
const jobApplicationController = require('../controllers/jobApplicationController');

// If you have authentication middleware, import it
// const { authenticate, isAdmin } = require('../middleware/auth');

// ==========================================
// PUBLIC ROUTES
// ==========================================

/**
 * @route   POST /api/job-application/submit
 * @desc    Submit a new job application (public)
 * @access  Public
 */
router.post('/submit', jobApplicationController.submitApplication);

// ==========================================
// ADMIN ROUTES (Add authentication middleware if you have it)
// ==========================================

/**
 * @route   GET /api/job-application/all
 * @desc    Get all applications with filters
 * @access  Admin
 * @query   status, jobId, search, page, limit, sortBy, order
 */
router.get('/all', jobApplicationController.getAllApplications);
// If you have auth: router.get('/all', authenticate, isAdmin, jobApplicationController.getAllApplications);

/**
 * @route   GET /api/job-application/stats
 * @desc    Get application statistics
 * @access  Admin
 * @query   jobId (optional)
 */
router.get('/stats', jobApplicationController.getApplicationStats);
// If you have auth: router.get('/stats', authenticate, isAdmin, jobApplicationController.getApplicationStats);

/**
 * @route   GET /api/job-application/job/:jobId
 * @desc    Get all applications for a specific job
 * @access  Admin
 * @query   status, page, limit
 */
router.get('/job/:jobId', jobApplicationController.getApplicationsByJob);
// If you have auth: router.get('/job/:jobId', authenticate, isAdmin, jobApplicationController.getApplicationsByJob);

/**
 * @route   GET /api/job-application/:id
 * @desc    Get single application by ID
 * @access  Admin
 */
router.get('/:id', jobApplicationController.getApplicationById);
// If you have auth: router.get('/:id', authenticate, isAdmin, jobApplicationController.getApplicationById);

/**
 * @route   PATCH /api/job-application/:id/status
 * @desc    Update application status
 * @access  Admin
 * @body    { status: 'pending' | 'under_review' | 'shortlisted' | 'rejected' | 'selected', adminNotes?: string }
 */
router.patch('/:id/status', jobApplicationController.updateApplicationStatus);
// If you have auth: router.patch('/:id/status', authenticate, isAdmin, jobApplicationController.updateApplicationStatus);

/**
 * @route   DELETE /api/job-application/:id
 * @desc    Delete an application
 * @access  Admin
 */
router.delete('/:id', jobApplicationController.deleteApplication);
// If you have auth: router.delete('/:id', authenticate, isAdmin, jobApplicationController.deleteApplication);

module.exports = router;