const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

const createJSONWebToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
}

const sendJSONWebToken = (user, statusCode, res) => {
    const token = createJSONWebToken(user._id);
    const cookieOptions = {
        expiresIn: new Date(Date.now() + 30*24*60*60*1000),
        httpOnly: true
    }
    
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: 'Success',
        token,
        data: {
            user
        }
    })
}

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passconf: req.body.passconf
        });
        sendJSONWebToken(newUser, 201, res);
    }
    catch(err) {
        res.status(200).json({
            status: 'Failure',
            message: err.message
        })
    }
}

exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ email }).select('+password');
        if(user && await user.correctPassword(password, user.password)) {
            sendJSONWebToken(user, 200, res);
        }
        else {
            res.status(403).json({
                status: 'Failure',
                message: 'Either email or password is incorrect'
            })
        }
    }
    catch(err) {
        res.status(200).json({
            status: 'Failure',
            message: err.message
        })
    }
}