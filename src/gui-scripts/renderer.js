const { ipcRenderer } = require("electron");

const select = selector => document.querySelector(selector);

let container = select("#messages");
let progressBar = select("#progressBar");
let version = select("#version");

ipcRenderer.on("message", (event, text) => {
    let message = document.createElement("div");
    message.innerHTML = text;
    container.appendChild(message);
});

ipcRenderer.on("version", (event, text) => {
    version.innerText = text;
});

ipcRenderer.on("download-progress", (event, text) => {
    progressBar.style.width = `${text}%`;
});

const { getFiles, getLastLine } = require("../modules/files");

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

document.getElementById("form-input").value = pentacamAutocsvPath;
let fileIndex = 0; // TODO: just for simulation, remove this when watcher appears

const path = require("path");

select("#form").addEventListener("submit", evt => {
    evt.preventDefault();
    const input = evt.target[0];

    const aFile = getFiles(input.value)[fileIndex];
    fileIndex++;

    console.log("Leyendo..", aFile);
    if (!filesToAnalyze.includes(aFile)) {
        return;
    }

    getLastLine(path.join(pentacamAutocsvPath, aFile)).then(
        lastLine => {
            console.log({ file: aFile, data: lastLine });
        },
        err => {
            alert(err);
        }
    );
});
