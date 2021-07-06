const Post = require('../models/postModel');
const appError = require('../utils/appError');

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