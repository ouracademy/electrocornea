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

// TODO: validate that folder contains appropiate filesToAnalyze
const pentacamAutocsvPath = "/home/diana/code/electrocornea/files";

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

const sendRequest = aFileName => lastLine => {
    console.log({ file: aFileName, data: lastLine });
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
    processFile
};