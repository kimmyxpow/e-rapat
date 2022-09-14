const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema(
    {
        _id: mongoose.Types.ObjectId,
        name: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

module.exports = CategorySchema
