const { createLogger, format, transports } = require("winston");

require("winston-mongodb");

const { store } = require("./store");
const loggingUri = store.get("loggingUriInput");

const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports:
    // loggingUri
    // ? [
    //     new transports.MongoDB({
    //       db: loggingUri
    //     })
    //   ]
    // : [new transports.Console()]
    [
      new transports.File({
        filename: "keratoconus-cornea.log"
      })
      // new transports.Http({
      //   ssl: true,
      //   host: "keratoconus-exams.herokuapp.com",
      //   port: 443,
      //   path: "winston"
      // })
    ]
});

module.exports = {
  logger,
  loggingUri
};
