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

const { read_csv } = require("../modules/read_csvs");

const marker_by_files = {
  "ZERNIKE-WFA.CSV": 1000,
  "ZERNIKE-ELE.CSV": 1,
  "SUMMARY-LOAD.CSV": 30000,
  "PACHY-LOAD.CSV": 3000,
  "KEIO-LOAD.CSV": 123,
  "INDEX-LOAD.CSV": 30000,
  "Fourier-LOAD.CSV": 3000,
  "EccSag-LOAD.CSV": 123,
  "COR-PWR-LOAD.CSV": 123,
  "CorneoScleral-LOAD.CSV": 123,
  "CHAMBER-LOAD.CSV": 30000,
  "BADisplay-LOAD.CSV": 123,
  "AXLScan_Result-LOAD.CSV": 30000
};

const fs = require("fs");
const get_files = folder_path => {
  return fs.readdirSync(folder_path);
};

const pentacamAutocsvPath = "/home/artmadeit/Escritorio/Prueba";

document.getElementById("form-input").value = pentacamAutocsvPath;
let fileIndex = 0;

const path = require("path");

select("#form").addEventListener("submit", evt => {
  evt.preventDefault();
  const input = evt.target[0];

  const aFile = get_files(input.value)[fileIndex];
  fileIndex++;

  console.log("Leyendo..", aFile);
  const isAFileUsedInMLProcess = Object.keys(marker_by_files).find(
    file => file == aFile
  );
  // haber ahora probare yaap
  // estas ahi?? sip el dearriba funciona find hay otro nombre q devuelve booleano no ?

  if (!isAFileUsedInMLProcess) {
    return;
  }

  const getSkipLinesByFile = fileName => marker_by_files[fileName];

  read_csv(
    path.join(pentacamAutocsvPath, aFile),
    (skipLines = getSkipLinesByFile(aFile))
  ).then(
    result => {
      // llega hasta aca... oohh
      // si ta haciendo bien devulve arreglo vacio
      //   si hay que editar esos valores, le tamos poniendo al AXL un
      //   "AXLScan_Result-LOAD.CSV": 30000
      //   CUANDO en realidad solo tiene nose unos 5000 si otro es calcualr ese numeor// calcular markers y guardarlo
      //   numeor gerande
      //   ajap.. oye ire a comer dianap, le doy commit
      //   ire a comer me da hambre
      // si comiteaa y luego segimos
      //   /home/artmadeit/electrocornea/src/gui-scripts/renderer.js:60 Leyendo.. AXLScan_Result-LOAD.CSV
      //   /home/artmadeit/electrocornea/src/gui-scripts/renderer.js:78 []
      //   /home/artmadeit/electrocornea/src/gui-scripts/renderer.js:60 Leyendo.. BADisplay-LOAD.CSV
      //   /home/artmadeit/electrocornea/src/gui-scripts/renderer.js:78 [{"0":"Hurtado Valdivia","1":"Juan","2":"10839-post cxl-rlc","3":"06/20/1988","4":"10/03/2019","5":"22:49:52","6":"Izq.  ","7":"(25) Esc�ner 3D
      console.log(JSON.stringify(result));
      // el devuelve un arreglo de objecto [ {'0':'arthur','1':'hj'} ]
      // do none olo leyo ? no :() q sale en err
    },
    err => {
      alert(err);
    }
  );
});
