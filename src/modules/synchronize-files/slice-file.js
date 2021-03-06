const slice = require("slice-file");
const iconv = require("iconv-lite");

const sliceFile = (filePath, start, end) =>
  streamToString(
    slice(filePath)
      .slice(start, end)
      .pipe(iconv.decodeStream("ISO-8859-1"))
      .pipe(iconv.encodeStream("UTF-8"))
  );

// const iconv = new Iconv("ISO-8859-1", "UTF-8");
const getLastLinesFiles = (filePath, n) => {
  throw "error";
};
// streamToString(
//   slice(filePath)
//     .slice(-n)
//     .pipe(iconv)
// );

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
