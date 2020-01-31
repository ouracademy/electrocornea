const chokidar = require("chokidar");
const path = require("path");

const { store } = require("./store");
const { logger } = require("./log");

// TODO: validate that folder contains appropiate filesToAnalyze
const pentacamReportPath = store.get("reportUriInput");

const got = require("got");
const FormData = require("form-data");
const fs = require("fs");

const uploadFile = filePath => {
  const form = new FormData();

  form.append("file", fs.createReadStream(filePath));

  return got.post("http://127.0.0.1:8000/report", {
    body: form
  });
};

const isAnalyzable = aFile => true;

const processFile = aFilePath => {
  console.log(aFilePath);

  const aFileName = path.basename(aFilePath);

  logger.info(`Leyendo..${aFileName}`);
  if (!isAnalyzable(aFileName)) {
    return;
  }

  uploadFile(aFilePath).then(response => {
    console.log(response);
  });
};

const startWatch = () => {
  const watcher = chokidar.watch(pentacamReportPath, {
    awaitWriteFinish: true,
    ignoreInitial: true
  });
  watcher.on("add", path => {
    processFile(path);
  });
  return watcher;
};

module.exports = {
  pentacamReportPath,
  startWatch,
  isAnalyzable,
  processFile
};
