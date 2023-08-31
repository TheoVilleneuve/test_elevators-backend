const mongoose = require("mongoose");

const elevatorHistorySchema = mongoose.Schema({
  elevatorID: String,
  departureFloor: Number,
  arrivalFloor: Number,
});

const elevatorHistory = mongoose.model(
  "elevatorHistory",
  elevatorHistorySchema
);

module.exports = elevatorHistory;
