const Store = require("electron-store");

const currentLinesByFile = {
    "ZERNIKE-WFA.CSV": 1,
    "ZERNIKE-ELE.CSV": 1,
    "SUMMARY-LOAD.CSV": 1,
    "PACHY-LOAD.CSV": 1,
    "KEIO-LOAD.CSV": 1,
    "INDEX-LOAD.CSV": 1,
    "Fourier-LOAD.CSV": 1,
    "EccSag-LOAD.CSV": 1,
    "COR-PWR-LOAD.CSV": 1,
    "CorneoScleral-LOAD.CSV": 1,
    "CHAMBER-LOAD.CSV": 1,
    "BADisplay-LOAD.CSV": 1,
    "AXLScan_Result-LOAD.CSV": 1
};

const store = new Store({
    defaults: {
        pentacamAutocsvPath: "pentacam-path",
        currentLinesByFile: currentLinesByFile
    }
});

module.exports = {
    store
};
