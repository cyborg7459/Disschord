const appError = require('../utils/appError');
const User = require('../models/userModel');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            status: 'Success',
            data: {
                users
            }
        })
    }
    catch(err) {
        return next(err);
    }
}

exports.getSingleUser = async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.params.username});
        if(!user) return next(new appError('No such user exists', 404));
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })
    }
    catch(err) {
        return next(err);
    }
}