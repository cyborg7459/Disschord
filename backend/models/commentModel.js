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
    }
})

commentSchema.index({ forPost: 1});

commentSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'byUser',
        select: '-servers -serversOwned -upvotedPosts -downvotedPosts -email -name'
    })
    next();
})

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;