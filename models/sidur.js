const mongoose = require("mongoose");

const sidurSchema = mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  start: {
    type: Date,
  },
  end: {
    type: Date,
  },
  qubes: [],
});

module.exports = mongoose.model("Sidur", sidurSchema);
