const express = require('express');
const router = express.Router();

const serverController = require('../controllers/serverController');
const authController = require('../controllers/authController');

router.route('/')
.get(authController.protect, serverController.getAllServers)
.post(authController.protect, serverController.createNewServer);

router.route('/:id')
.get(authController.protect, serverController.getSingleServer)
.delete(authController.protect, serverController.deleteServer);

module.exports = router;