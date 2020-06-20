const mongoose = require("mongoose");

const shiftSchema = mongoose.Schema({
  qube:{
    type: Number,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  typeShift: {
    type: Number,
    required: true,
  },
  isAvilable: {
    type: Boolean,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dateShift: {
    type: Date,
    required: true,

  }
});

module.exports = mongoose.model("Shift", shiftSchema);
