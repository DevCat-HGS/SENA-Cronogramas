const express = require('express');
const router = express.Router();
const instructorRequestController = require('../controllers/instructorRequestController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public route for instructors to submit registration requests
router.post('/submit', instructorRequestController.submitRequest);

// Admin routes - protected with authentication and admin role check
router.get('/', protect, adminOnly, instructorRequestController.getAllRequests);
router.get('/:id', protect, adminOnly, instructorRequestController.getRequestById);
router.put('/:id/approve', protect, adminOnly, instructorRequestController.approveRequest);
router.put('/:id/reject', protect, adminOnly, instructorRequestController.rejectRequest);

module.exports = router;