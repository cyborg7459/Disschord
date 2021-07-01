const express = require('express');
const router = express.Router();

const serverController = require('../controllers/serverController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.route('/')
.get(serverController.getAllServers)
.post(serverController.createNewServer);

router.use('/:slug', serverController.checkServerExistence);
router.route('/:slug')
.get(serverController.getSingleServer)
.patch(serverController.checkServerOwnership, serverController.updateServerDetails)
.delete(serverController.checkServerOwnership, serverController.deleteServer);

router.route('/:slug/request')
.get(serverController.authorizeAdmins, serverController.getPendingRequests)
.post(serverController.sendRequestToJoin);

router.route('/:slug/request/:id')
.delete(serverController.deleteJoinRequest)
.post(serverController.authorizeAdmins, serverController.acceptJoinRequest);

router.use('/:slug/admins/:id', serverController.checkServerOwnership);
router.route('/:slug/admins/:id')
.post(serverController.makeAdmin)
.delete(serverController.removeFromAdmin);

module.exports = router;