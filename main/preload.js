/* eslint-disable no-underscore-dangle */
const localforage = require('localforage');
const { ipcRenderer } = require('electron');
const log = require('electron-log');

const fontList = require('font-list');

const [value] = process.argv;
if (process.env.APPDATA) {
  localforage.setItem('userPath', process.env.APPDATA);
 window.localStorage.setItem('userPath', process.env.APPDATA);
} else {
  localforage.setItem('userPath', process.env.APPDATA);
  window.localStorage.setItem('userPath', `${process.env.HOME}/.config`);
}
const fetchFonts = async () => {
  const _fonts = [];
  fontList.getFonts()
  .then((fonts) => {
    fonts.forEach((element) => {
      _fonts.push(element.replace(/\"/gm, ''));
    });
    localforage.setItem('font-family', _fonts);
  })
  .catch((err) => {
    console.log(err);
  });
};
fetchFonts();

window.localStorage.setItem('defaultappPath', value);
// Since we disabled nodeIntegration we can reintroduce
// needed node functionality here
process.once('loaded', () => {
  global.ipcRenderer = ipcRenderer;
  global.log = log;
  global.path = value;
});
