const mongoose = require("mongoose");

const Message = mongoose.model(
  "Message",
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    message: String,
    date: {
        type: Date,
        default: () => new Date(+new Date() + 7*24*60*60*1000)
    }
  })
);

module.exports = Message;
