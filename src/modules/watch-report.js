const chokidar = require("chokidar");
const path = require("path");

/**
 * Used in Keratoconus REST API
 */

const { store } = require("./store");
const { logger } = require("./log");

// TODO: validate that folder contains appropiate filesToAnalyze
const pentacamReportPath = store.get("reportUriInput");

const B2 = require("backblaze-b2");

const b2 = new B2({
    applicationKeyId: "000e47ee7219c340000000001",
    applicationKey: "K00033x74HxDraU9g7IhYOU7hN9ziLQ"
});
async function uploadFile(file, fileName) {
    try {
        await b2.authorize(); // must authorize first
        const response = await b2.uploadFile({
            uploadUrl:
                "https://pod-000-1065-00.backblaze.com/b2api/v2/b2_upload_file/fee4871ece37f24169fc0314/c000_v0001065_t0014",
            uploadAuthToken:
                "4_000e47ee7219c340000000001_0191efe3_191de0_upld_pVvZ_RDAx_bUJxhWb8__VzRl0ks=",
            fileName,
            contentLength: 0, //TODO
            mime: "pdf", //TODO
            data: file
        });
        return response.data;
    } catch (err) {
        console.log("Error getting bucket:", err);
    }
}
function read_file(path) {
    const fs = require("fs");
    return fs.readFileSync(path);
}
function test_upload() {
    const path = "/home/diana/Downloads/reportes";
    const name = "Abad Castro_Sheila_OD_05112019_104954.pdf";
    uploadFile(buffer, path + "/" + name);
}

const isAnalyzable = aFile => true;
const { getLastLine } = require("./files");

const processFile = aFilePath => {
    const aFileName = path.basename(aFilePath);

    logger.info(`Leyendo..${aFileName}`);
    if (!isAnalyzable(aFileName)) {
        return;
    }
    file = read_file(aFilePath);
    // TODO: parse name file
    uploadFile(file, aFileName);
};

const startWatch = () => {
    const watcher = chokidar.watch(pentacamReportPath, {
        awaitWriteFinish: true
    });
    watcher.on("add", path => {
        processFile(path);
    });
    return watcher;
};

module.exports = {
    pentacamReportPath,
    startWatch,
    isAnalyzable,
    processFile,
    store
};
