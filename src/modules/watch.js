const chokidar = require("chokidar");
const path = require("path");
const { sendRequest } = require("./send-request");
/**
 * Used in Keratoconus REST API
 */
const filesPentacam = [
    "SUMMARY.CSV",
    "PACHY.CSV",
    "KEIO.CSV",
    "INDEX.CSV",
    "Fourier.CSV",
    "COR-PWR.CSV",
    "CorneoScleral.CSV",
    "CHAMBER.CSV",
    "BADisplay.CSV",
    "AXLScan_Result.CSV"
];
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
    "AXLScan_Result-LOAD.CSV",
    ...filesPentacam
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
