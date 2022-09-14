const mongoose = require("mongoose");
const ParticipantSchema = require("../../database/schema/ParticipantSchema.js");

const Participant = mongoose.model("Participant", ParticipantSchema);

module.exports = Participant;
