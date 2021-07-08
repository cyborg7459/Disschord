const express = require('express');
const router = express.Router();

const commentController = require('../controllers/commentController');

router.route('/')
.get(commentController.getAllComments)
.post(commentController.addCommentToPost)

module.exports = router;