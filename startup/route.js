const home_router = require("../route/home");
const case_router = require("../route/case");
const user_router = require("../route/user");
const auth_router = require("../route/authn");
module.exports = function (app) {
  app.use("/", home_router);
  app.use("/api/cases", case_router);
  app.use("/api/users", user_router);
  app.use("/api/auth", auth_router);
};
