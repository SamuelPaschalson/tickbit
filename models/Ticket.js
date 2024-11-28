const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  ticket_title: {
    type: String,
    required: true,
    unique: true,
  },
  ticket_category: {
    type: String,
    required: true,
  },
  ticket_type: {
    type: String,
    required: true,
  },
  start_date: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  payment_Status: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Ticket", ticketSchema);
