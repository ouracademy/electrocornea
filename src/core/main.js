const { app, BrowserWindow } = require("electron");
const { autoUpdater } = require("electron-updater");

let win;

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

  win.on("closed", function(event) {
    watcher.close().then(() => (event.returnValue = false));
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
