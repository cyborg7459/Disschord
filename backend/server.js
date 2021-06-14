const dotenv = require('dotenv');
dotenv.config({
    path : './config.env'
})

const app = require('./app.js');

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server running on port 3000");
})