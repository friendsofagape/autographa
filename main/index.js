// Native
require('@electron/remote/main').initialize();
const { join } = require('path');
const { format } = require('url');

// Packages
const { BrowserWindow, app, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const prepareNext = require('electron-next');
const { autoUpdater } = require('electron-updater');

let mainWindow;
// Prepare the renderer once the app is ready
function createWindow() {
 mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    icon: join(__dirname, '../public/icons/ag-logo.ico'),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      enableRemoteModule: true,
      contextIsolation: false,
      preload: join(__dirname, 'preload.js'),
    },
  });
  require('@electron/remote/main').enable(mainWindow.webContents);
  const url = isDev
    ? 'http://localhost:8000'
    : format({
        pathname: join(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
      });

  mainWindow.loadURL(url);
  autoUpdater.checkForUpdatesAndNotify();
}

// Quit the app once all windows are closed
app.on('ready', async () => {
  await prepareNext('./renderer');
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// listen the channel `message` and resend the received message to the renderer process
// ipcMain.on('message', (event) => {
//   event.sender.send('appPath', process.env.APPDATA)
// })

ipcMain.on('app_version', (event) => {
  event.sender.send(
    'app_version',
    {
      version: app.getVersion(),
      appPath: process.env.APPDATA
      ? process.env.APPDATA : `${process.env.HOME}/.config`,
    },
);
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = `Download speed: ${ progressObj.bytesPerSecond}`;
  log_message = `${log_message } - Downloaded ${ progressObj.percent }%`;
  log_message = `${log_message } (${ progressObj.transferred }/${ progressObj.total })`;
  mainWindow.webContents.send(log_message);
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});
