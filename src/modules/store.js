const Store = require("electron-store");

const currentLinesByFile = {
    "ZERNIKE-WFA.CSV": 0,
    "ZERNIKE-ELE.CSV": 0,
    "SUMMARY-LOAD.CSV": 0,
    "PACHY-LOAD.CSV": 0,
    "KEIO-LOAD.CSV": 0,
    "INDEX-LOAD.CSV": 0,
    "Fourier-LOAD.CSV": 0,
    "EccSag-LOAD.CSV": 0,
    "COR-PWR-LOAD.CSV": 0,
    "CorneoScleral-LOAD.CSV": 0,
    "CHAMBER-LOAD.CSV": 0,
    "BADisplay-LOAD.CSV": 0,
    "AXLScan_Result-LOAD.CSV": 0
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
