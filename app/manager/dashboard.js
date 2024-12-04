const { WebContentsView, ipcMain } = require('electron');
const path = require('path');
const { adjustView } = require('./viewManager');
const ipcDashboard = require('./ipcDashboard');

let sidebarView;
let browserView;
let frameView;

function createDashboardView(mainWindow) {
  sidebarView = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '..', 'main', 'preload.js'),
    },
  });
  mainWindow.contentView.addChildView(sidebarView);
  sidebarView.webContents.loadFile(
    path.join(__dirname, '..', 'renderer', 'views', 'sidebar.html')
  );

  browserView = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '..', 'main', 'preload.js'),
    },
  });
  mainWindow.contentView.addChildView(browserView);
  //browserView.webContents.openDevTools();
  browserView.webContents.loadURL('https://www.google.com');

  frameView = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '..', 'main', 'preload.js'),
    },
  });
  mainWindow.contentView.addChildView(frameView);
  frameView.webContents.loadFile(
    path.join(__dirname, '..', 'renderer', 'views', 'frame.html')
  );

  adjustView(mainWindow, sidebarView, browserView, frameView);

  mainWindow.on('resize', () => {
    adjustView(mainWindow, sidebarView, browserView, frameView);
  });

  ipcDashboard.dashboard(browserView, sidebarView, frameView);
}

ipcMain.on('browser-forward', () => {
  browserView.webContents.navigationHistory.goForward();
});
ipcMain.on('browser-back', () => {
  if (browserView.webContents.navigationHistory.canGoBack()) {
    browserView.webContents.navigationHistory.goBack();
  }
});

module.exports = {
  createDashboardView,
  getViews: () => ({ sidebarView, browserView, frameView }),
};
