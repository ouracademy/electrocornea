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

const Store = require("electron-store");

const store = new Store({
  defaults: {
    pentacamAutocsvPath: "pentacam-path"
  }
});

// TODO: validate that folder contains appropiate filesToAnalyze
const pentacamAutocsvPath = store.get("pentacamAutocsvPath");

const isAnalyzable = aFile => filesToAnalyze.includes(aFile);
const { getLastLine } = require("./files");

const processFile = aFilePath => {
  const aFileName = path.basename(aFilePath);

  console.log("Leyendo..", aFileName);
  if (!isAnalyzable(aFileName)) {
    return;
  }
  console.log("Enviando request...");
  getLastLine(aFilePath).then(sendRequest(aFileName), err => {
    alert(err);
  });
};

const url = "https://keratoconus-api.herokuapp.com/line";
const axios = require("axios").default;

const sendRequest = aFileName => lastLine => {
  axios
    .post(url, { file: aFileName, data: lastLine })
    .then(response => console.log("Success:", response))
    .catch(error => console.error("Error:", error));
};

const startWatch = () => {
  const watcher = chokidar.watch(
    filesToAnalyze.map(x => path.join(pentacamAutocsvPath, x))
  );
  watcher.on("change", path => {
    console.log(`File ${path} has been change`);
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
