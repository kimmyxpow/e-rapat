require('dotenv').config()
const mongoose = require('mongoose')

module.exports = mongoose
    .connect(process.env.MONGO_CONNECTION)
    .then()
    .catch((e) => console.log(e))
