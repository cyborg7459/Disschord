const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title : {
        type: String, 
        required: [true, 'A post must have a title']
    },
    imageUrl : String,
    content: {
        type: String,
        required: [true, 'A post must have a title']
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
})

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;