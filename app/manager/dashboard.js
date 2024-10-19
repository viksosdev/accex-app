const { WebContentsView } = require('electron');
const path = require('path');
const { adjustView } = require('./viewManager');

function createDashboardView(mainWindow) {
  const sidebarView = new WebContentsView({
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

  const browserView = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '..', 'main', 'preload.js'),
    },
  });
  mainWindow.contentView.addChildView(browserView);
  browserView.webContents.loadURL('https://www.google.com');

  const frameView = new WebContentsView({
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
}

module.exports = {
  createDashboardView,
};
