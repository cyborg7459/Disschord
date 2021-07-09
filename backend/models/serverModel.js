const mongoose = require('mongoose');
const slugify = require('slugify');

const serverSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String,
        required: [true, 'A server must have a name'],
    },
    isPrivate: {
        type: Boolean,
        required: [true, 'A server must have a privacy status']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'A server must have a description']
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A server must have an owner']
    },
    admins: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    createdAt : Date,
    pendingRequests : [{
        type: mongoose.Schema.ObjectId,
        ref : 'User'
    }],
    members: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }]
})

serverSchema.pre(/^find$/, function(next) {
    this.select('-pendingRequests');
    next();
})

serverSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {
        lower: true
    });
    if(this.isNew) {
        this.createAt = new Date(Date.now());
    }
    next();
})

serverSchema.pre(/^find/, function(next) {
    this.select('-__v');
    this.populate({
        path: 'members',
        select: '-passwordChangedAt -upvotedPosts -downvotedPosts -serversOwned -password -passwordResetToken -passwordResetExpiry -servers'
    });
    this.populate({
        path: 'admins',
        select: '-passwordChangedAt -upvotedPosts -downvotedPosts -serversOwned -password -passwordResetToken -passwordResetExpiry -servers'
    });
    this.populate({
        path: 'owner',
        select: '-passwordChangedAt -upvotedPosts -downvotedPosts -serversOwned -password -passwordResetToken -passwordResetExpiry -servers'
    });
    this.populate({
        path: 'pendingRequests',
        select: '-passwordChangedAt -servers -password -passwordResetToken -passwordResetExpiry'
    })
    next();
})

const Server = mongoose.model('Server', serverSchema);
module.exports = Server;