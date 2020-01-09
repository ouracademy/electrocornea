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

const { pentacamAutocsvPath, store } = require("../modules/watch");

let folderInput = document.getElementById("form-input");
folderInput.value = pentacamAutocsvPath;

select("#form").addEventListener("submit", evt => {
  evt.preventDefault();

  store.set("pentacamAutocsvPath", folderInput.value);
  alert("Ruta AutoCSV cambiada");
});

let loggingUriInput = document.getElementById("logging-uri");
loggingUriInput.value = store.get("loggingUriInput");

select("#logging-uri-form").addEventListener("submit", evt => {
  evt.preventDefault();

  store.set("loggingUriInput", loggingUriInput.value);
  alert("Ruta Logging URI form cambiada");
});
