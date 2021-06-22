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