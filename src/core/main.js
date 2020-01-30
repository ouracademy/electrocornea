const { app, BrowserWindow } = require("electron");
const { autoUpdater } = require("electron-updater");
const { store } = require("../modules/store");
const { logger } = require("../modules/log");

let win;
let cron;
let fileSynchronizer;

let willQuitApp = false;

const dispatch = data => {
    win.webContents.send("message", data);
};

const createDefaultWindow = () => {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.on("closed", () => {
        win = null;
    });

    win.loadFile("src/gui/index.html");
    // win.webContents.openDevTools();

    win.on("close", e => {
        logger.info("init close app");
        // if (!willQuitApp) {
        //     e.preventDefault();
        //     win.hide();

        //     fileSynchronizer.stop();
        //     fileSynchronizer.on("stopped", () => {
        //         cron.stop();

        //         fileSynchronizer = null;
        //         cron = null;
        //         willQuitApp = true;
        //         app.quit();
        //     });
        // } else {
        //     logger.info("close app");
        // }
    });

    return win;
};

app.on("ready", () => {
    createDefaultWindow();

    autoUpdater.checkForUpdatesAndNotify();

    win.webContents.on("did-finish-load", () => {
        win.webContents.send("version", "v" + app.getVersion());
    });
});

app.on("window-all-closed", () => {
    app.quit();
});

autoUpdater.on("checking-for-update", () => {
    dispatch("Checking for update...");
});

autoUpdater.on("update-available", info => {
    dispatch("Update available. Download will start");
});

autoUpdater.on("update-not-available", info => {
    dispatch("Update not available.");
});

autoUpdater.on("error", err => {
    dispatch("Error in auto-updater. " + err);
});

autoUpdater.on("download-progress", progressObj => {
    // let log_message = "Download speed: " + progressObj.bytesPerSecond
    // log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
    // log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
    // dispatch(log_message)
    dispatch("Update available. Download started");
    win.webContents.send("download-progress", progressObj.percent);
});

autoUpdater.on("update-downloaded", info => {
    dispatch(
        "Update downloaded, please close and open this application to update it"
    );
});

const { startWatch } = require("../modules/watch");
watcher = startWatch();

// const { startWatch } = require("../modules/watch");
// watcher = startWatch();

// const {
//     cronLongProcess,
//     FileSynchronizer
// } = require("../modules/synchronize-files/synchronize-files");

// fileSynchronizer = new FileSynchronizer();
// cron = cronLongProcess(fileSynchronizer);
// cron.start();

// logger.info("running cron " + cron.running);

// // console.log(app.getPath("userData"));
