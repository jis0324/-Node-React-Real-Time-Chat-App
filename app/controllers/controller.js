const db = require("../models");
const User = db.user;
const Contact = db.contact;
const PublicMessage = db.publicMessage;

// const getUsersFromContacts = (contacts) => {
//   var return_data = Promise.all(contacts.map(contact => User.findById(contact, {_id: 1, username: 1})));
//   return return_data;
// }

exports.allAccess = (req, res) => {
  res.status(200).send("Let's Chat!");
};

exports.checkAuth = (req, res) => {
  User.findById(req.userId).then((user) => {
    res.status(200).send({user: user});
    return;
  })
  
}

exports.getOldMessages = async (skipCount) => {
  var messages = await PublicMessage
    .find({})
    .populate('user')
    .limit(20)
    .skip(skipCount)
    .sort({"date": -1});
  
  return messages.reverse();
}

exports.saveNewMessage = async (data) => {
  return await (await PublicMessage.create(data)).execPopulate('user');
}

// exports.getContactList = (req, res) => {
//   req.contacts = [];
//   Contact.findOne({
//       user: req.userId
//     }, async (err, user) => {
//       if (err) {
//         res.status(500).send({ message: err });
//         return;
//       };

//       if (!user) {
//         const contact = new Contact({
//           user: req.userId,
//           contacts: []
//         });

//         user = contact.save((err, result) => {
//           if (err) {
//             res.status(500).send({ message: err });
//             return;
//           }
//           return result;
//         });
//       }

//       var data = await getUsersFromContacts(user.contacts);
//       res.status(200).send({data: data});
//       return;
//   });
// };

// exports.searchContactList = (req, res) => {
//   User.find({
//       username: { "$regex": req.query.searchkey, "$options": "i" }
//     }, {"_id": 1, "username": 1}, (err, users) => {
//       if (err) {
//         res.status(500).send({ message: err });
//         return;
//       };

//       res.status(200).send({ data: users });

//   });
// };

// exports.addContact = (req, res) => {
//   var contactId = req.body.contactId;

//   Contact.findOne({
//     user: req.userId
//   },
//   async (err, user) => {
//     if (err) {
//       res.status(500).send({ message: err });
//       return;
//     }

//     if (user.contacts.indexOf(contactId) < 0) {
//       user.contacts.unshift(contactId);
//       user = await user.save();
//     }

//     var data = await getUsersFromContacts(user.contacts);
//     res.status(200).send({data: data});
//     return;
//   });
// }

// exports.getMessages = async (data) => {
//   var roomName1 = data.userId + "-" + data.objId;
//   var roomName2 = data.objId + "-" + data.userId;
//   var messages = await Message.find({
//     room: {
//       $regex: roomName1 | roomName2
//     }}, {limit:20}).sort({date: -1}).exec((err, result) => {
//       if (err) console.log(err);
//       console.log(result);
//     });

//   return messages;
// }



// exports.getMessages = async (req, res) => {
//   var userId = req.userId;
//   var objId = req.query.objId

//   var sendMsgs = await Message.find({user: userId, receiver: objId});
//   var receiveMsgs = await Message.find({user: objId, receiver: userId});

//   var data = {
//     sendMsgs: sendMsgs,
//     receiveMsgs: receiveMsgs
//   }
//   console.log(data);
//   // res.status(200).send({data: data});
//   return data;
// }




exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
