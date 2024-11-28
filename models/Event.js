const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  event_title: {
    type: String,
    required: true,
    unique: true,
  },
  event_category: {
    type: String,
    required: true,
  },
  event_type: {
    type: String,
    required: true,
  },
  start_date: {
    type: String,
    required: true,
  },
  start_time: {
    type: String,
    required: true,
  },
  end_time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  event_description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  running_event: {
    type: String,
    required: true,
  },
  ticket_name: {
    type: String,
    required: true,
  },
  ticket_price: {
    type: Number,
    required: true,
  },
  interested: {
    type: Number,
    default: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Event", eventSchema);
