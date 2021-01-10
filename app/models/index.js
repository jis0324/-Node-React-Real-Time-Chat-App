const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { PublicMessage } = require("./message.model")
const { PrivateMessage } = require("./message.model")
const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.contact = require("./contact.model");
db.publicMessage = PublicMessage;
db.privateMessage = PrivateMessage;

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;