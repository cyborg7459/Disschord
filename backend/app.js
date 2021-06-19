const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/userRoutes');

if(process.env.NODE_ENV === 'development') {
    console.log('Running app in development mode');
    app.use(morgan('dev'));
}
else 
    console.log('Running app in production mode');

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Credentials", true)
    next();
})
app.get('/api/v1/test', (req, res) => {
    console.log(req.cookies);
    res.status(200).json({
        status: 'Success',
        message: 'Everything seems to work fine'
    })
})
app.use('/api/v1/users', userRouter);

module.exports = app;