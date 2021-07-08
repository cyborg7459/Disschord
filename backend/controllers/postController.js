const Post = require('../models/postModel');
const appError = require('../utils/appError');

exports.checkPostExistence = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postID);
        if(!post) return next(new appError('No post found with the given ID', 404));
        req.post = post;
        next();
    }
    catch(err) {
        return next(err);
    }
}

exports.checkPostOwnership = async (req, res, next) => {
    try {
        if(!req.post.byUser._id.equals(req.user._id)) return next(new appError('You are not authorized for this action', 403));
        next();
    }
    catch(err) {
        return next(err);
    }
}

exports.getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({});
        res.status(200).json({
            status: 'success',
            length: posts.length,
            data: {
                posts
            }
        })
    }
    catch(err) {
        return next(err);
    }
}

exports.getSinglePost = async (req, res, next) => {
    try {
        res.status(200).json({
            status: 'success',
            data: req.post
        })
    }
    catch(err) {
        return next(err);
    }
}

exports.addNewPost = async (req, res, next) => {
    try {
        console.log(req.body);
        const newPost = {
            title: req.body.title,
            forServer: req.server._id,
            content: req.body.content,
            byUser: req.user._id
        }

        const post = await Post.create(newPost);
        
        res.status(200).json({
            status: 'success',
            post
        })
    }
    catch(err) {
        next(err);
    }
}

exports.updatePost = async (req, res, next) => {
    try {
        const updatedPost = {
            title: req.body.title,
            imageUrl: req.body.imageUrl,
            content: req.body.content
        }

        const post = await Post.findByIdAndUpdate(req.post._id, updatedPost, {
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: post
        })
    }
    catch(err) {
        next(err);
    }
}

exports.deletePost = async (req, res, next) => {
    try {
        await Post.findByIdAndDelete(req.post._id);

        res.status(200).json({
            status: 'success',
            message: 'Post deleted successfully'
        })
    }
    catch(err) {
        return next(err);
    }
}