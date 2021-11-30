/* eslint-disable no-underscore-dangle */
const { ipcRenderer } = require('electron');
const log = require('electron-log');
const fontList = require('font-list');

const _fonts = [];
const fetchFonts = async () => {
  fontList.getFonts()
  .then((fonts) => {
    fonts.forEach((element) => {
      // eslint-disable-next-line no-useless-escape
      _fonts.push(element.replace(/\"/gm, ''));
    });
  })
  .catch((err) => {
    throw (err);
  });
};
fetchFonts();

// Since we disabled nodeIntegration we can reintroduce
// needed node functionality here
process.once('loaded', () => {
  global.ipcRenderer = ipcRenderer;
  global.log = log;
  global.fonts = _fonts;
});
