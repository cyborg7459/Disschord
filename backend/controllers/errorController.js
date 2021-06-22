const appError = require('../utils/appError');

const devError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status, 
        message: err.message,
        stack: err.stack,
        error: err
    })
}

const prodError = (err, res) => {
    if(err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status, 
            message: err.message
        })
    }
    else {
        res.status(500).json({
            status: 'Error',
            message: 'Something went wrong'
        })
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error';
    if(process.env.NODE_ENV === 'development')
        devError(err, res);
    else 
        prodError(err, res);
}