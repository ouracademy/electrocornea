const fs = require("fs");
const readline = require("readline");
const Stream = require("stream");

const iconv = require("iconv-lite");

function readFile(filename) {
  const content = fs.createReadStream(filename);

  return content
    .pipe(iconv.decodeStream("ISO-8859-1"))
    .pipe(iconv.encodeStream("UTF-8"));
}

/**
 * Sample of using it:
 * @example
 * getLastLine("/home/diana/code/electrocornea/files/SUMMARY.CSV").then(console.log)
 */
const getLastLine = fileName => {
  let inStream = readFile(fileName);
  let outStream = new Stream();
  return new Promise((resolve, reject) => {
    let rl = readline.createInterface(inStream, outStream);
    let currentLine = "";
    rl.on("line", function(line) {
      currentLine = line;
    });

    inStream.on("end", function() {
      resolve(currentLine);
    });

    rl.on("error", function() {
      reject("Error en " + currentLine);
    });
  });
};

const getFiles = folder_path => {
  return fs.readdirSync(folder_path);
};

const addTexToFile = (path, text) => {
  var stream = fs.createWriteStream(path, { flags: "a" });
  stream.on("open", () => {
    stream.write(text);
  });
};

module.exports = {
  getLastLine: getLastLine,
  getFiles: getFiles,
  addTexToFile
};
