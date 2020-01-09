const winston = require("winston");
require("winston-mongodb");

const { store } = require("./store");
const loggingUri = store.get("loggingUriInput");

const logger = winston.createLogger({
  transports: loggingUri
    ? [
        new winston.transports.MongoDB({
          db: loggingUri
        })
      ]
    : [new winston.transports.Console()]
});

module.exports = {
  logger,
  loggingUri
};
