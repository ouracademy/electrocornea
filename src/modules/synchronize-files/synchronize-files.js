const { existNewData } = require("./exist-new-data");

const { job } = require("cron");
const each10Minutes = f => job("*/3 * * * * *", f, null, true);

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

const { sliceFile } = require("../slice-file");

const getNextLine = async (lineNumber, filePath) => {
  const nextLineNumber = lineNumber + 1;
  const lines = await sliceFile(filePath, lineNumber, nextLineNumber);
  return { nextLineNumber, line: lines[0] };
};

const synchronizeFilesWithServer = async () => {
  for (let file of Object.keys(currentLinesByFile)) {
    await synchronizeFileWithServer(file);
  }
};

const pentacamPath = "/home/artmadeit/Escritorio/Pentacam.AutoCSV";
const { join } = require("path");

const synchronizeFileWithServer = async fileName => {
  const filePath = join(pentacamPath, fileName);

  while (await existNewData(currentLinesByFile, filePath)) {
    const { nextLineNumber, line } = await getNextLine(
      currentLinesByFile[fileName],
      filePath
    );
    // await sendRequest(file)(line);
    currentLinesByFile[fileName] = nextLineNumber;
  }
};

let isRunning = false;
each10Minutes(() => {
  console.log("Tick", new Date(), ", isRunning: ", isRunning);
  console.log(currentLinesByFile);

  if (!isRunning) {
    isRunning = true;
    synchronizeFilesWithServer().then(() => {
      isRunning = false;
    });
  }
});

module.exports = {};
