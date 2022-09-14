const mongoose = require('mongoose')

const MeetingSchema = new mongoose.Schema(
    {
        _id: mongoose.Types.ObjectId,
        event: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        place: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
)

module.exports = MeetingSchema
