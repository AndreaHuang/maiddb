const bodyParser = require("body-parser");
const config = require("config");
const constants = require("../config/constants");
module.exports = function (app) {
  // parse application/x-www-form-urlencoded
  app.use(
    bodyParser.urlencoded({
      limit: config.get(constants.CONFIG_REQUEST_SIZE),
      extended: true,
    })
  );

  // parse application/json
  app.use(
    bodyParser.json({ limit: config.get(constants.CONFIG_REQUEST_SIZE) })
  );
};
