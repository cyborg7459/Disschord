const dotenv = require('dotenv');
dotenv.config({
    path : './config.env'
})

const app = require('./app.js');
const mongoose = require('mongoose');

mongoose.connect(process.env.DB, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, () => {
    console.log('Sucessfully conneted to database');
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server running on port 3000");
})