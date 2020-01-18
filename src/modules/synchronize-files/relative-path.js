const { join } = require("path");
const relativePath = fileRelativePath => join(__dirname, fileRelativePath);

exports.relativePath = relativePath;
