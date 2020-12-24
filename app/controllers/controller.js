const db = require("../models");
const User = db.user;
const Role = db.role;
const Contact = db.contact;
const Message = db.message;

exports.allAccess = (req, res) => {
  res.status(200).send("Let's Chat!");
};


exports.getContactList = (req, res) => {
  Contact.findOne({
      user: req.userId
    }, (err, user) => {
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

      var contacts = [];
      for (let i = 0; i < user.contacts.length; i++) {
        var contactUser = () => {
          User.findById(user.contacts[i], {_id: 1, username: 1}, (err, cuser) => {
            if (err) {
              return {};
            }

            return {
              "id": cuser._id,
              "username" : cuser.username
            }
          });
        }
        
        if (contactUser) {
          contacts.push(contactUser);
        }
      }

      res.status(200).send({ data: contacts });

  });
};

exports.searchContactList = (req, res) => {
  User.find({
      username: { "$regex": req.query.searchkey, "$options": "i" }
    }, {"_id": 1, "username": 1}, (err, users) => {
      console.log(users)
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

    console.log(user);
    var contacts = [];
    for (let i = 0; i < user.contacts.length; i++) {
      User.findOne({
        _id: user.contacts[i]
      }, {_id: 1, username: 1}, (err, cuser) => {
        if (err) {
          return {};
        }
        console.log(111)

        if (cuser) {
          contacts.push({
            "id": cuser._id,
            "username" : cuser.username
          });
        }
      });
    }
    console.log(contacts)

    res.status(200).send({ data: contacts });
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
