const { ipcRenderer } = require('electron');
const log = require('electron-log');

const [value] = process.argv;
window.localStorage.setItem('defaultappPath', value);
// Since we disabled nodeIntegration we can reintroduce
// needed node functionality here
process.once('loaded', () => {
  global.ipcRenderer = ipcRenderer;
  global.log = log;
  global.path = value;
});
