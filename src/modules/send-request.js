const { logger } = require("./log");
const got = require("got");

const url = "http://127.0.0.1:8000/exams-file"; // "https://keratoconus-exams.herokuapp.com/exams-file";

const sendRequest = aFileName => lastLine =>
  got
    .post(url, {
      json: { file: aFileName, data: lastLine },
      responseType: "json"
    })
    .then(response =>
      logger.info(
        "Success:" +
          response.statusCode +
          ", data:" +
          JSON.stringify(response.body)
      )
    )
    .catch(error => logger.warn(JSON.stringify(error)));

exports.sendRequest = sendRequest;
