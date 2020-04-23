
const path = require('path');
const { app, Menu } = require('electron');

// import settings from 'electron-settings';
const {
  createWindow,
  defineWindow,
  getWindow
} = require(path.join(__dirname, 'electronWindows.js'));

//const dbUtil = require('../src/util/DbUtil');

//dbUtil.dbSetupAll()


const isMac = process.platform === 'darwin'
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const MAIN_WINDOW_ID = 'main';

/**
 * Creates a window for the main application.
 * @returns {Window}
 */
function createMainWindow() {
  const windowOptions = {
    width: 980,
    minWidth: 980,
    height: 580,
    minHeight: 580,
    show: false,
    center: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    },
    title: app.getName()
  };
  return createWindow(MAIN_WINDOW_ID, windowOptions);
}

/**
 * Creates a window for the splash screen.
 * This uses a dedicated webpack entry point so it loads fast.
 * @returns {Electron.BrowserWindow}
 */
function createSplashWindow() {
  const windowOptions = {
    width: 400,
    height: 200,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false
    },
    frame: false,
    show: true,
    center: true,
    title: app.name
  };
  const window = defineWindow('splash', windowOptions);

  if (IS_DEVELOPMENT) {
    window.loadURL('http://localhost:3000/splash.html');
  } else {
    window.loadURL(`file://${path.join(__dirname, '/splash.html')}`);
  }

  return window;
}

const menuTemplate = [
    {
        label: 'File',
        submenu: [
          isMac ? { role: 'close' } : { role: 'quit' }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          ...(isMac ? [
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
              label: 'Speech',
              submenu: [
                { role: 'startspeaking' },
                { role: 'stopspeaking' }
              ]
            }
          ] : [
            { role: 'delete' },
            { type: 'separator' },
            { role: 'selectAll' }
          ])
        ]
      },
    {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.reload()
          }
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator:
          process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.webContents.toggleDevTools()
          }
        }
      }
    ]
  }
];
const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

// prevent multiple instances of the main window
app.requestSingleInstanceLock();

app.on('second-instance', () => {
  const window = getWindow(MAIN_WINDOW_ID);
  if (window) {
    if (window.isMinimized()) {
      window.restore();
    }
    window.focus();
  }
});

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  const window = getWindow(MAIN_WINDOW_ID);
  if (window === null) {
    createMainWindow();
  }
});
//
// async function preProcess() {
//   createWindow();
//   try {
//     await dbUtil.dbSetupAll();
//   } catch(err) {
//     console.log('Error while App intialization.' + err);
//   };
// };

// create main BrowserWindow with a splash screen when electron is ready
app.on('ready', async () => {
  // dbUtil.dbSetupAll();
  const splashWindow = createSplashWindow();
  const mainWindow = createMainWindow();
  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      splashWindow.close();
      mainWindow.show();
    }, 300);
  });
  // await preProcess();
});
