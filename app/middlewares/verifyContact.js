const db = require("../models");
const Contact = db.contact;

checkContactExisted = (req, res, next) => {
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
      user.save(err => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });
    }
    next();
    return;
  });

};

const verifyContact = {
  checkContactExisted
}
module.exports = verifyContact;
