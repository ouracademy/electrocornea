const winston = require("winston");
require("winston-mongodb");

const { store } = require("./store");
const loggingUri = store.get("loggingUriInput");

const logger = winston.createLogger({
    transports:
        // loggingUri
        // ? [
        //     new winston.transports.MongoDB({
        //       db: loggingUri
        //     })
        //   ]
        // : [new winston.transports.Console()]
        [
            // new winston.transports.File({
            //     filename: "keratoconus-cornea.log"
            // }),
            new winston.transports.Http({
                ssl: true,
                host: "keratoconus-exams.herokuapp.com",
                port: 443,
                path: "winston"
            })
        ]
});

module.exports = {
    logger,
    loggingUri
};