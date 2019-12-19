const fs = require("fs");
const readline = require("readline");
const Stream = require("stream");

/**
 * Sample of using it:
 * @example
 * getLastLine("/home/diana/code/electrocornea/files/SUMMARY.CSV").then(console.log)
 */
const getLastLine = fileName => {
    let inStream = fs.createReadStream(fileName);
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

        rl.on("error", reject);
    });
};

const getFiles = folder_path => {
    return fs.readdirSync(folder_path);
};

module.exports = {
    getLastLine: getLastLine,
    getFiles: getFiles
};
