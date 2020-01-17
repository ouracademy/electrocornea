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

const fs = require("fs");

const getFileLinesNumber = filePath =>
  // https://stackoverflow.com/questions/12453057/node-js-count-the-number-of-lines-in-a-file
  new Promise((resolve, reject) => {
    let lineCount = 1;
    fs.createReadStream(filePath)
      .on("data", buffer => {
        let idx = -1;
        lineCount--; // Because the loop will run once for idx=-1
        do {
          idx = buffer.indexOf(10, idx + 1);
          lineCount++;
        } while (idx !== -1);
      })
      .on("end", () => {
        resolve(lineCount);
      })
      .on("error", reject);
  });

const { basename } = require("path");

const existNewData = (currentLinesByFile, filePath) =>
  getFileLinesNumber(filePath).then(
    x => currentLinesByFile[basename(filePath)] !== x
  );

const { sliceFile } = require("./art");

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

  const fileLines = await getFileLinesNumber(filePath);
  // const existNewData_ = // await existNewData(currentLinesByFile, filePath);

  while (currentLinesByFile[fileName] <= fileLines) {
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

module.exports = {
  getFileLinesNumber,
  sliceFile,
  existNewData
};
