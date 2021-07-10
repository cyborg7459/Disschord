const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const appError = require('../utils/appError');

const createJSONWebToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
}

const sendJSONWebToken = (user, statusCode, res) => {
    const token = createJSONWebToken(user._id);
    const cookieOptions = {
        expiresIn: new Date(Date.now() + 30*24*60*60*1000),
        sameSite: 'none',
        secure: true
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

exports.getUserFromJWT = (req, res, next) => {
    try {
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })
    }
    catch(err) {
        next(err);
    }
}

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passconf: req.body.passconf
        });
        sendJSONWebToken(newUser, 201, res);
    }
    catch(err) {
        return next(err);
    }
}

exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ email }).select('+password');
        if(user && await user.correctPassword(password, user.password)) sendJSONWebToken(user, 200, res);
        else return next(new appError('Either email or password is incorrect', 200));
    }
    catch(err) {
        next(new appError(err.message, 200));
    }
}

exports.logout = (req, res, next) => {
    res.cookie('jwt', null, {
        expiresIn: new Date(Date.now() + 500)
    });
    res.status(200).json({
        status: 'Success',
        message: 'Successfully logged out'
    });
}

exports.protect = (req, res, next) => {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
            token = req.headers.authorization.split(' ')[1];
        else if(req.cookies.jwt)
            token = req.cookies.jwt;
        
        console.log(token);

        if(!token || token === 'null') return next(new appError('You are not logged in', 401));

        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if(err) return next(err);
            else {
                const user = await User.findById(decodedToken.id);
                if(!user) return next(new appError('Given user does not exists', 401));
                else if(user.changedPasswordAfter(decodedToken.iat)) return next(new appError('Password has been changed. Please enter latest password', 401));
                req.user = user;
                next();
            }
        })
    }
    catch(err) {
        return next(err);
    }
}