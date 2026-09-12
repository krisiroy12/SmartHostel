const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hostelName: {
      type: String,
      required: true,
    },

    floor: {
      type: Number,
      required: true,
    },

    roomNumber: {
      type: String,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
      default: 1,
    },

    occupied: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Available", "Full", "Maintenance"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);