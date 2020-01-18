const { existNewData } = require("./exist-new-data");

const { CronJob } = require("cron");
const each10Minutes = f => new CronJob("*/3 * * * * *", f);

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

const { sliceFile } = require("./slice-file");

const getNextLine = async (lineNumber, filePath) => {
  const nextLineNumber = lineNumber + 1;
  const lines = await sliceFile(filePath, lineNumber, nextLineNumber);
  return { nextLineNumber, line: lines[0] };
};

const pentacamPath = "/home/artmadeit/Escritorio/Pentacam.AutoCSV";
const { join } = require("path");

const EventEmitter = require("events");

class FileSynchronizer extends EventEmitter {
  isRunning = false;

  async run() {
    this.isRunning = true;

    for (let file of Object.keys(currentLinesByFile)) {
      await this.synchronizeFileWithServer(file);
    }

    this.isRunning = false;
  }

  async synchronizeFileWithServer(fileName) {
    const filePath = join(pentacamPath, fileName);

    while (await existNewData(currentLinesByFile, filePath)) {
      const { nextLineNumber, line } = await getNextLine(
        currentLinesByFile[fileName],
        filePath
      );
      // await sendRequest(file)(line);
      currentLinesByFile[fileName] = nextLineNumber;

      this.emit("taskFinished");
    }
  }
}

const cronSynchronizeFiles = () => {
  const fileSynchronizer = new FileSynchronizer();
  return each10Minutes(() => {
    console.log(
      "Tick",
      new Date(),
      ", isRunning: ",
      fileSynchronizer.isRunning
    );
    console.log(currentLinesByFile);

    if (!fileSynchronizer.isRunning) {
      fileSynchronizer.run();
    }
  });
};

module.exports = {
  cronSynchronizeFiles
};
