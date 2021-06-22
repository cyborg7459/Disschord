const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/userRoutes');
const serverRouter = require('./routes/serverRoutes');
const globalErrorHandler = require('./controllers/errorController');

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
app.use('/api/v1/server', serverRouter);
app.use(globalErrorHandler);

module.exports = app;