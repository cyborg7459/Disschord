const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');

router.route('/')
.get(postController.getAllPosts)
.post(postController.addNewPost)

router.use('/:postID', postController.checkPostExistence);

router.route('/:postID')
.get(postController.getSinglePost)
.patch(postController.checkPostOwnership, postController.updatePost)
.delete(postController.checkPostOwnership, postController.deletePost)

module.exports = router;