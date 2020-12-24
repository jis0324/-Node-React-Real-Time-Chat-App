const { authJwt, verifyContact } = require("../middlewares");
const controller = require("../controllers/controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/all", controller.allAccess);

  app.get("/api/contactlist", [authJwt.verifyToken], controller.getContactList);

  app.get("/api/searchcontactlist", [authJwt.verifyToken], controller.searchContactList);

  app.post(
    "/api/addcontact",
    [
      authJwt.verifyToken,
      // verifyContact.checkContactExisted
    ],
    controller.addContact
  );

  app.get("/api/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );


};
