const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/register', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.use(authController.protect);
router.route('/')
.get(userController.getAllUsers)

router.route('/:username')
.get(userController.getSingleUser);

module.exports = router;