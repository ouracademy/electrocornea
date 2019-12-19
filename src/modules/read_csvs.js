const csv = require("csv-parser");
const fs = require("fs");

const read_csv = (path, skipLines = 0, separator = ";") => {
    const results = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(path)
            .pipe(
                csv({
                    skipLines: skipLines,
                    separator: separator,
                    headers: false
                })
            )
            .on("data", data => results.push(data))
            .on("end", () => {
                resolve(results);
            })
            .on("error", e => {
                reject(e);
            });
    });
};

module.exports = {
    read_csv: read_csv
};
