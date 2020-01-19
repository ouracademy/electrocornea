const { existNewData } = require("./exist-new-data");
const { store } = require("../store");
const { sendRequest } = require("../send-request");
const { logger } = require("../log");

const { CronJob } = require("cron");
const each10Minutes = f => new CronJob("*/3 * * * * *", f);

const getCurrentLinesByFile = (file = null) =>
    file
        ? store.get("currentLinesByFile")[file]
        : store.get("currentLinesByFile");

const setCurrentLinesByFile = (file, value) => {
    current = store.get("currentLinesByFile");
    current[file] = value;
    store.set("currentLinesByFile", current);
};

const { sliceFile } = require("./slice-file");

const getNextLine = async (lineNumber, filePath) => {
    const nextLineNumber = lineNumber + 1;
    const lines = await sliceFile(filePath, lineNumber, nextLineNumber);
    return { nextLineNumber, line: lines[0] };
};

const pentacamPath =
    store.get("pentacamAutocsvPath") ||
    "/home/artmadeit/Escritorio/Pentacam.AutoCSV";

const { join } = require("path");

const EventEmitter = require("events");

class FileSynchronizer extends EventEmitter {
    isRunning = false;
    stopExecution = false;

    async run() {
        this.isRunning = true;

        for (let file of Object.keys(getCurrentLinesByFile())) {
            await this.synchronizeFileWithServer(file);
        }

        this.isRunning = false;
    }

    async synchronizeFileWithServer(fileName) {
        const filePath = join(pentacamPath, fileName);

        while (await existNewData(getCurrentLinesByFile(), filePath)) {
            if (this.stopExecution) {
                this.isRunning = false;
                this.emit("stopped");
                break;
            }

            try {
                const { nextLineNumber, line } = await getNextLine(
                    getCurrentLinesByFile(fileName),
                    filePath
                );
                logger.info(
                    JSON.stringify({
                        lineNumber: nextLineNumber - 1,
                        file: fileName
                    })
                );
                await sendRequest(fileName)(line);
                setCurrentLinesByFile(fileName, nextLineNumber);
            } catch (e) {
                logger.warning(e.stack);
            }
        }
    }

    stop() {
        this.stopExecution = true;
    }
}

const cronLongProcess = aProcess =>
    each10Minutes(() => {
        logger.info(`Tick ${new Date()} isRunning ${aProcess.isRunning}`);

        if (!aProcess.isRunning) {
            aProcess.run();
        }
    });

module.exports = {
    cronLongProcess,
    FileSynchronizer
};
