const { ipcRenderer } = require("electron");
const { addTexToFile } = require("../modules/files");
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

const { store } = require("../modules/store");
const { pentacamAutocsvPath } = require("../modules/watch");
const { pentacamReportPath } = require("../modules/watch-report");
const { logger, loggingUri } = require("../modules/log");

let folderInput = document.getElementById("form-input");
folderInput.value = pentacamAutocsvPath;

select("#form").addEventListener("submit", evt => {
    evt.preventDefault();

    store.set("pentacamAutocsvPath", folderInput.value);
    alert("Ruta AutoCSV cambiada");
    logger.info(`Ruta AutoCSV cambiada a ${folderInput.value}`);
});

let loggingUriInput = document.getElementById("logging-uri");
loggingUriInput.value = loggingUri;

select("#logging-uri-form").addEventListener("submit", evt => {
    evt.preventDefault();
    store.set("loggingUriInput", loggingUriInput.value);
    alert("Logging URI cambiada");
});

let reportFormInput = document.getElementById("report-form-input");
reportFormInput.value = pentacamReportPath;
select("#report-form").addEventListener("submit", evt => {
    evt.preventDefault();
    store.set("reportUriInput", reportFormInput.value);
    alert("Ruta de reportes pentacam cambiada");
});
