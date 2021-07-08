const Comment = require('../models/commentModel');

exports.getAllComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ forPost: req.post._id });
        res.status(200).json({
            status: 'succcess',
            count: comments.length,
            data: {
                comments
            }
        })
    }
    catch(err) {
        return next(err);
    }
}

exports.addCommentToPost = async (req, res, next) => {
    try {
        const comment = await Comment.create({
            text: req.body.text,
            byUser: req.user._id,
            forPost: req.post._id
        })
        res.status(200).json({
            status: 'success',
            data: {
                comment
            }
        })
    }
    catch(err) {
        return next(err);
    }
}

exports.deleteComment = async (req, res, next) => {

}
