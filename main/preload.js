const { ipcRenderer } = require('electron');
const log = require('electron-log');
const { app } = require('electron');

const [value] = process.argv;
console.log(process.env.APPDATA);
window.localStorage.setItem('userPath', process.env.APPDATA);
window.localStorage.setItem('defaultappPath', value);
// Since we disabled nodeIntegration we can reintroduce
// needed node functionality here
process.once('loaded', () => {
  global.ipcRenderer = ipcRenderer;
  global.log = log;
  global.path = value;
});
