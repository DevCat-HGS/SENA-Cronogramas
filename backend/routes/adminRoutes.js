const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', adminController.loginAdmin);

// Protected routes - require authentication
router.get('/profile', protect, adminOnly, adminController.getAdminProfile);
router.put('/profile', protect, adminOnly, adminController.updateAdminProfile);

// Superadmin only routes
router.post('/register', protect, adminOnly, adminController.registerAdmin);
router.get('/', protect, adminOnly, adminController.getAllAdmins);
router.get('/:id', protect, adminOnly, adminController.getAdminById);
router.put('/:id', protect, adminOnly, adminController.updateAdmin);
router.delete('/:id', protect, adminOnly, adminController.deleteAdmin);

module.exports = router;