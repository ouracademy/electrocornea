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

const log = console.log.bind(console);

const isAnalyzable = aFile => filesToAnalyze.includes(aFile);

const startWatch = () => {
    const watcher = chokidar.watch(
        filesToAnalyze.map(x => path.join(pentacamAutocsvPath, x))
    );
    watcher.on("change", path => log(`File ${path} has been change`));
    return watcher;
};

module.exports = {
    pentacamAutocsvPath,
    filesToAnalyze,
    startWatch,
    isAnalyzable
};
