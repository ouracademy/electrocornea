const { logger } = require("./log");
const got = require("got");

const url = "http://127.0.0.1:8000"; // "https://keratoconus-exams.herokuapp.com/exams-file";

const client = got.extend({
  prefixUrl: url
});

const sendRequest = aFileName => lastLine =>
  client
    .post("exams-file", {
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

module.exports = {
  sendRequest,
  client
};
