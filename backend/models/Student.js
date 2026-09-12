const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    rollNumber: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    course: {
      type: String,
    },

    year: {
      type: Number,
    },

    hostel: {
      type: String,
    },

    roomNumber: {
      type: String,
    },

    documents: {
      type: [String],
      default: [],
    },

    bookingStatus: {
      type: String,
      enum: ["Not Booked", "Pending", "Confirmed", "Rejected"],
      default: "Not Booked",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema); 