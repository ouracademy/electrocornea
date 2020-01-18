const { app, BrowserWindow } = require("electron");
const { autoUpdater } = require("electron-updater");

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
    console.log("cron");
    // e.preventDefault();
    // win.hide();

    // fileSynchronizer.stop();

    // console.log("despuesDeStop", cron);
    // fileSynchronizer.on("stopped", () => {
    //   console.log("on stopped", cron);
    //   cron && cron.stop();
    //   fileSynchronizer = null;
    //   cron = null;
    //   app.quit();
    // });

    if (!willQuitApp) {
      e.preventDefault();
      win.hide();

      setTimeout(() => {
        console.log("After timeout");
        willQuitApp = true;
        app.quit();
      }, 7000);
    }
  });

  // win.onbeforeunload = e => {
  //   console.log("I do not want to be closed");

  //   // Unlike usual browsers that a message box will be prompted to users, returning
  //   // a non-void value will silently cancel the close.
  //   // It is recommended to use the dialog API to let the user confirm closing the
  //   // application.
  //   e.returnValue = false; // equivalent to `return false` but not recommended
  //   // fileSynchronizer.stop();
  //   // fileSynchronizer.on("stopped", () => {
  //   //   cron.stop();
  //   //   fileSynchronizer = null;
  //   //   cron = null;
  //   //   event.returnValue = true;
  //   // });

  //   // setTimeout(() => {
  //   //   console.log("holas");
  //   //   win.close();
  //   // }, 5000);
  // };

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

const {
  cronLongProcess,
  FileSynchronizer
} = require("../modules/synchronize-files/synchronize-files");

fileSynchronizer = new FileSynchronizer();
cron = cronLongProcess(fileSynchronizer);
cron.start();

console.log({ algooooo: cron.running });
