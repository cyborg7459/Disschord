const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String, 
        required: [true, 'A comment cannot be empty']
    },
    byUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A comment must have a user']
    }, 
    forPost: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: [true, 'A comment must belong to some post']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    }
})

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;