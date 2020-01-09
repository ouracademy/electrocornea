const Store = require("electron-store");

const store = new Store({
  defaults: {
    pentacamAutocsvPath: "pentacam-path"
  }
});

module.exports = {
  store
};
