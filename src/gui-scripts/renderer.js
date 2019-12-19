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

const {
    pentacamAutocsvPath,
    filesToAnalyze,
    isAnalyzable
} = require("../modules/watch");
const { getFiles, getLastLine } = require("../modules/files");

document.getElementById("form-input").value = pentacamAutocsvPath;
let fileIndex = 0; // TODO: just for simulation, remove this when watcher appears

const path = require("path");

select("#form").addEventListener("submit", evt => {
    evt.preventDefault();
    const input = evt.target[0];

    const aFile = getFiles(input.value)[fileIndex];
    fileIndex++;
    processFile(aFile);
});

const processFile = aFile => {
    console.log("Leyendo..", aFile);
    if (!isAnalyzable(aFile)) {
        return;
    }

    console.log("Enviando request...");
    getLastLine(path.join(pentacamAutocsvPath, aFile)).then(
        lastLine => {
            console.log({ file: aFile, data: lastLine });
        },
        err => {
            alert(err);
        }
    );
};
