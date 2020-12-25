const db = require("../models");
const User = db.user;
const Contact = db.contact;
const Message = db.message;

exports.allAccess = (req, res) => {
  res.status(200).send("Let's Chat!");
};

const getUsersFromContacts = async (contacts) => {
  var return_data = [];
  for (const contact of contacts) {
    var return_item = await User.findById(contact, {_id: 1, username: 1});
    return_data.push(return_item)
  }
  return return_data;
}

exports.getContactList = (req, res) => {
  req.contacts = [];
  Contact.findOne({
      user: req.userId
    }, async (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      };

      if (!user) {
        const contact = new Contact({
          user: req.userId,
          contacts: []
        });

        user = contact.save((err, result) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          return result;
        });
      }

      var data = await getUsersFromContacts(user.contacts);
      res.status(200).send({data: data});
      return;
  });
};

exports.searchContactList = (req, res) => {
  User.find({
      username: { "$regex": req.query.searchkey, "$options": "i" }
    }, {"_id": 1, "username": 1}, (err, users) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      };

      res.status(200).send({ data: users });

  });
};

exports.addContact = (req, res) => {
  let contactId = req.body.contactId;

  Contact.findOne({
    user: req.userId
  },
  (err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user.contacts.indexOf(contactId) < 0) {
      user.contacts.unshift(contactId);
      user = user.save(err, result => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        return result;
      });
    }

    res.status(200).send({ message: "success" });
  });
}




exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
