const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title : {
        type: String, 
        required: [true, 'A post must have a title']
    },
    imageUrl : String,
    content: {
        type: String,
        required: [true, 'A post must have some content']
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    byUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A post must have an owner']
    },
    forServer: String
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})

postSchema.virtual('comments', {
    ref: 'Comment',
    foreignField: 'forPost',
    localField: 'id'
})

postSchema.pre(/^find/, function(next) {
    this.select('-__v');
    this.populate({
        path: 'byUser',
        select: '-servers -upvotedPosts -downvotedPosts -serversOwned -active'
    })
    next();
})

const Post = mongoose.model('Post', postSchema);
module.exports = Post;