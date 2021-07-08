const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const commentRouter = require('./commentRoutes');

router.use('/:postID/comments', postController.checkPostExistence, commentRouter);
router.route('/')
.get(postController.getAllPosts)
.post(postController.addNewPost)

router.use('/:postID', postController.checkPostExistence);

router.route('/:postID')
.get(postController.getSinglePost)
.patch(postController.checkPostOwnership, postController.updatePost)
.delete(postController.checkPostOwnership, postController.deletePost)

router.post('/:postID/upvote', postController.upvotePost);
router.post('/:postID/downvote', postController.downvotePost);

module.exports = router;