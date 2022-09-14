const mongoose = require('mongoose')
const MeetingSchema = require('../../database/schema/MeetingSchema.js')

const Meeting = mongoose.model('Meeting', MeetingSchema)

module.exports = Meeting
