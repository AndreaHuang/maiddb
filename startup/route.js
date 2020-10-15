const home_router = require("../route/home");
const case_router = require("../route/case");
const user_router = require("../route/user");
const auth_router = require("../route/authn");
const file_router = require("../route/file");
module.exports = function (app) {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", [
      "Content-Type",
      "x-maid-token",
    ]);
    next();
  });

  app.use("/", home_router);
  app.use("/api/cases", case_router);
  app.use("/api/users", user_router);
  app.use("/api/auth", auth_router);
  app.use("/api/file", file_router);
};
