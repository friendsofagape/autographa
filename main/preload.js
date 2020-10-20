const { ipcRenderer, app } = require('electron');
const log = require('electron-log');

// Since we disabled nodeIntegration we can reintroduce
// needed node functionality here
process.once('loaded', () => {
  global.ipcRenderer = ipcRenderer;
  global.app = app;
  global.log = log;
});
