const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');
const { protect, instructorOnly } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', instructorController.loginInstructor);

// Protected routes - require instructor authentication
router.get('/profile', protect, instructorOnly, instructorController.getInstructorProfile);
router.put('/profile', protect, instructorOnly, instructorController.updateInstructorProfile);

// Activity and event management routes
router.get('/activities', protect, instructorOnly, instructorController.getInstructorActivities);
router.get('/events', protect, instructorOnly, instructorController.getInstructorEvents);
router.put('/events/:eventId/respond', protect, instructorOnly, instructorController.respondToEvent);

module.exports = router;