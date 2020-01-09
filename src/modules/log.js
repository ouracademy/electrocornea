const winston = require("winston");
require("winston-mongodb");

const { store } = require("./watch");
const loggingUri = store.get("loggingUriInput");

const logger = winston.createLogger({
  transports: [
    new winston.transports.MongoDB({
      db: loggingUri
    })
  ]
});

module.exports = {
  logger,
  loggingUri
};
