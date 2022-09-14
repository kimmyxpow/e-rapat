const mongoose = require('mongoose')
const UserSchema = require('../../database/schema/UserSchema.js')

const User = mongoose.model('User', UserSchema)

module.exports = User
