const Post = require('../models/postModel');
const User = require('../models/userModel');
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

exports.upvotePost = async (req, res, next) => {
    try {
        let isUpvoted = req.user.upvotedPosts.find(postId => postId.equals(req.post._id));
        let isDownvoted = req.user.downvotedPosts.find(postId => postId.equals(req.post._id));

        let upvotedPosts = req.user.upvotedPosts;
        let downvotedPosts = req.user.downvotedPosts;

        if(isUpvoted) return next(new appError('You cannot upvote a post twice', 400));
        if(isDownvoted) {
            req.post.downvotes--;
            req.post.upvotes++;
            await req.post.save();
            downvotedPosts = downVotedPosts.filter(postID => !postID.equals(req.post._id));
        }
        else {
            req.post.upvotes++;
            await req.post.save();
        }

        upvotedPosts.push(req.post._id);
        await User.findByIdAndUpdate(req.user._id, {
            upvotedPosts, 
            downvotedPosts
        }, {
            runValidators: false
        })

        res.status(200).json({
            status: 'success',
            message: 'post upvoted'
        })
    }
    catch(err) {
        return next(err)
    }
}

exports.downvotePost = async (req, res, next) => {
    try {
        let isUpvoted = req.user.upvotedPosts.find(postId => postId.equals(req.post._id));
        let isDownvoted = req.user.downvotedPosts.find(postId => postId.equals(req.post._id));

        let upvotedPosts = req.user.upvotedPosts;
        let downvotedPosts = req.user.downvotedPosts;

        if(isDownvoted) return next(new appError('You cannot downvote a post twice', 400));
        if(isUpvoted) {
            req.post.downvotes++;
            req.post.upvotes--;
            await req.post.save();
            upvotedPosts = upvotedPosts.filter(postID => !postID.equals(req.post._id));
        }
        else {
            req.post.downvotes++;
            await req.post.save();
        }

        downvotedPosts.push(req.post._id);
        await User.findByIdAndUpdate(req.user._id, {
            upvotedPosts, 
            downvotedPosts
        }, {
            runValidators: false
        })

        res.status(200).json({
            status: 'success',
            message: 'post downvoted'
        })
    }
    catch(err) {
        return next(err)
    }
}