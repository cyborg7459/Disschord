const express = require('express');
const router = express.Router();

const serverController = require('../controllers/serverController');
const authController = require('../controllers/authController');

router.route('/')
.get(authController.protect, serverController.getAllServers)
.post(authController.protect, serverController.createNewServer);

router.route('/:slug')
.get(authController.protect, serverController.getSingleServer)
.delete(authController.protect, serverController.deleteServer);

router.route('/:slug/request')
.get(authController.protect, serverController.getPendingRequests)
.post(authController.protect, serverController.sendRequestToJoin);

module.exports = router;