const mongoose = require("mongoose");

const PublicMessage = mongoose.model(
  "PublicMessage",
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    message: String,
    date: {
        type: Date,
        default: () => new Date()
    }
  })
);

const PrivateMessage = mongoose.model(
  "PrivateMessage",
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
    },
    room: String,
    message: String,
    date: {
        type: Date,
        default: () => new Date()
    }
  })
);

module.exports = {
  PublicMessage,
  PrivateMessage
};
