const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        _id: mongoose.Types.ObjectId,
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            default: 'admin',
        },
    },
    {
        timestamps: true,
    }
)

module.exports = UserSchema
