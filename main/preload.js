const { ipcRenderer } = require('electron');
const log = require('electron-log');

const [value] = process.argv;
if (process.env.APPDATA) {
 window.localStorage.setItem('userPath', process.env.APPDATA);
} else {
  window.localStorage.setItem('userPath', `${process.env.HOME}/.config`);
}
window.localStorage.setItem('defaultappPath', value);
// Since we disabled nodeIntegration we can reintroduce
// needed node functionality here
process.once('loaded', () => {
  global.ipcRenderer = ipcRenderer;
  global.log = log;
  global.path = value;
});
