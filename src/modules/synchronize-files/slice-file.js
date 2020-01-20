const slice = require("slice-file");
const Iconv = require("iconv").Iconv;
const iconv = new Iconv("ISO-8859-1", "UTF-8");

const sliceFile = (filePath, start, end) =>
  streamToString(
    slice(filePath)
      .slice(start, end)
      .pipe(iconv)
  );

const getLastLinesFiles = (filePath, n) =>
  streamToString(
    slice(filePath)
      .slice(-n)
      .pipe(iconv)
  );

function streamToString(stream) {
  // https://stackoverflow.com/questions/10623798/how-do-i-read-the-contents-of-a-node-js-stream-into-a-string-variable
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on("data", chunk => chunks.push(chunk.toString()));
    stream.on("error", reject);
    stream.on("end", () => resolve(chunks));
  });
}

module.exports = {
  sliceFile,
  getLastLinesFiles
};
