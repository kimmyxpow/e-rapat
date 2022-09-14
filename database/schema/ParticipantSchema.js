const mongoose = require('mongoose')

const ParticipantSchema = new mongoose.Schema(
    {
        meeting: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Meeting',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        in: {
            type: String,
        },
        out: {
            type: String,
        },
        status: {
            type: Number,
            required: true,
            default: 0
        },
    },
    { timestamps: true }
)

module.exports = ParticipantSchema
