const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/register', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.route('/')
    .get(authController.protect, userController.getAllUsers)

module.exports = router;