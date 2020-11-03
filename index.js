const express = require("express");
const rendertron = require('rendertron-middleware');
const BOTS = rendertron.botUserAgents.concat('googlebot');
const BOT_UA_PATTERN = new RegExp(BOTS.join('|'), 'i');

require("express-async-errors");
const debugger_startup = require("debug")("startup");


const app = express();
const winston = require("winston");
const config = require("config");
const constants = require("./config/constants")

const error = require("./middleware/error");

//start up
require("./startup/logging")();
require("./startup/config")();
require("./startup/database")();
//Test script for unhandled exception or rejection
// throw new Error("Start up failure");
// const p = Promise.reject("Promise rejection");
// p.then(() => {
//   console.log("OK");
// });
//middleware middleware
require("./startup/middleware")(app);
//router handler middleware
require("./startup/route")(app);

//error handling must be the last one
app.use(error);
app.use(rendertron.makeMiddleware({
  proxyUrl: config.get(constants.CONFIG_RENDERSTRON),
  userAgentPattern: BOT_UA_PATTERN
}));

const port = process.env.PORT || 3001;
const env = app.get("env");

const server = app.listen(port, () => {
  winston.info(`server started on port ${port} for environment ${env} ...`);
});
module.exports = server;
