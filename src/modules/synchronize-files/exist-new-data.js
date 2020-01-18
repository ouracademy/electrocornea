const { basename } = require("path");

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

const existNewData = (currentLinesByFile, filePath) =>
  getFileLinesNumber(filePath).then(x => {
    const fileLines = x - 1; // -1 because Oculus adds always an empty line
    // Example: the file ZERNIKE-WFA.CSV looks like this
    // 10787 Llamoga Guevara ;Geraldine;
    // 10788 Llamoga Guevara ;Geraldine;
    // 10789
    // The dictionary must run until line 10788
    // because the last line (10789) is an empty line.
    const headerLength = 1;
    if (fileLines <= headerLength) {
      return false;
    }
    return currentLinesByFile[basename(filePath)] < fileLines;
  });

module.exports = {
  existNewData,
  getFileLinesNumber
};
