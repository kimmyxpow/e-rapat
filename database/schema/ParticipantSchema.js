const mongoose = require('mongoose')

const ParticipantSchema = new mongoose.Schema(
    {
        meeting: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Meeting',
        },
        name: {
            type: String,
            required: true,
        },
        institute: {
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
            default: 0,
        },
    },
    { timestamps: true }
)

module.exports = ParticipantSchema
