const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'A user must have a name'],
        unique: true
    },
    email: {
        type: String, 
        required: [true, 'A user must have an email address'],
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email address']
    },
    password: {
        type: String, 
        required: [true, 'A user must have a password'],
        minLength: [6, 'A password must be atleast 6 characters long'],
        select: false
    },
    passconf: {
        type: String, 
        required: [true, 'A confirmation password is required'],
        validate: {
            validator: function(val) {
                return val === this.password;
            },
            message: 'Password and confirmation password do not match'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpiry: Date,
    active: {
        type: Boolean, 
        default: true,
        select: false
    }
})

// Pre-save middleware which does the function of converting a new password into a hash before storing it in tha databse
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    else {                      
        this.password = await bcrypt.hash(this.password, 12);
        this.passconf = undefined;
        next();
    }
});

// Pre-save middleware to ensure that if the password is changed, then the time of change is recorded in the password changed at property
userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next();
    else {
        this.passwordChangedAt = Date.now() - 1000;
        next();
    }
})

// Query middleware, which ensures that only active users are considered in any query regarding users
userSchema.pre(/^find/, function(next) {
    this.find({
        active: true
    });
    next();
})

// Schema method for comparing password provided by the user and the password stored in the database
userSchema.methods.correctPassword = function(userPassword, actualPassword) {
    return bcrypt.compare(userPassword, actualPassword);
}

// Schema method to check whether the JWT had been issued before password was changed or not. Returns true if password was changed after JWT issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/ 1000, 10);
        return JWTTimestamp < changedTimeStamp;
    }
    return false;
}

// Schema method to create a password reset token for reset password situations. Returns the reset token as it is for route, while storing the hashed version in 
// the database so that the route version can be hashed and then queried for from the database
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpiry = Date.now() + 10*60*1000;
    return resetToken;
}

const User = mongoose.model('User', userSchema);
module.exports = User;