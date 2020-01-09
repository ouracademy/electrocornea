const chokidar = require("chokidar");
const path = require("path");

/**
 * Used in Keratoconus REST API
 */
const filesToAnalyze = [
  "ZERNIKE-WFA.CSV",
  "ZERNIKE-ELE.CSV",
  "SUMMARY-LOAD.CSV",
  "PACHY-LOAD.CSV",
  "KEIO-LOAD.CSV",
  "INDEX-LOAD.CSV",
  "Fourier-LOAD.CSV",
  "EccSag-LOAD.CSV",
  "COR-PWR-LOAD.CSV",
  "CorneoScleral-LOAD.CSV",
  "CHAMBER-LOAD.CSV",
  "BADisplay-LOAD.CSV",
  "AXLScan_Result-LOAD.CSV"
];

const { store } = require("./store");
const { logger } = require("./log");

// TODO: validate that folder contains appropiate filesToAnalyze
const pentacamAutocsvPath = store.get("pentacamAutocsvPath");

const isAnalyzable = aFile => filesToAnalyze.includes(aFile);
const { getLastLine } = require("./files");

const processFile = aFilePath => {
  const aFileName = path.basename(aFilePath);

  logger.info(`Leyendo..${aFileName}`);
  if (!isAnalyzable(aFileName)) {
    return;
  }

  logger.info("Enviando request...");
  getLastLine(aFilePath)
    .then(sendRequest(aFileName))
    .catch(err => logger.warn(err));
};

const url = "http://127.0.0.1:8000/exams-file";
const axios = require("axios").default;

const sendRequest = aFileName => lastLine => {
  axios
    .post(url, { file: aFileName, data: lastLine })
    .then(response =>
      logger.info(
        "Success:" + response.status + ", data:" + JSON.stringify(response.data)
      )
    )
    .catch(error => logger.warn(JSON.stringify(error)));
};

const startWatch = () => {
  const watcher = chokidar.watch(
    filesToAnalyze.map(x => path.join(pentacamAutocsvPath, x)),
    {
      awaitWriteFinish: true
    }
  );
  watcher.on("change", path => {
    processFile(path);
  });
  return watcher;
};

module.exports = {
  pentacamAutocsvPath,
  filesToAnalyze,
  startWatch,
  isAnalyzable,
  processFile,
  store
};
