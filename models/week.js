const mongoose = require("mongoose");

const weekSchema = mongoose.Schema({
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
  shifts: [{type:mongoose.Schema.Types.ObjectId,ref:"Shift"}],
  remarks: {type:String}
});

module.exports = mongoose.model("Week", weekSchema);
