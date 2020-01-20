const { logger } = require("./log");

const url = "http://127.0.0.1:8000/exams-file";
const axios = require("axios").default;

const sendRequest = aFileName => lastLine =>
  axios
    .post(url, { file: aFileName, data: lastLine })
    .then(response =>
      logger.info(
        "Success:" + response.status + ", data:" + JSON.stringify(response.data)
      )
    )
    .catch(error => logger.warn(JSON.stringify(error)));

exports.sendRequest = sendRequest;
