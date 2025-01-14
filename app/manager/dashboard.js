const { WebContentsView, ipcMain } = require("electron");
const path = require("path");
const { adjustView } = require("./viewManager");
const ipcDashboard = require("./ipcDashboard");

let sidebarView;
let browserView;
let frameView;
let botView;

let botHeight = 0;
let botWidth = 0;

function createDashboardView(mainWindow) {
  sidebarView = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      frame: true,
      preload: path.join(__dirname, "..", "main", "preload.js"),
    },
  });
  mainWindow.contentView.addChildView(sidebarView);
  sidebarView.webContents.loadFile(
    path.join(__dirname, "..", "renderer", "views", "sidebar.html")
  );

  browserView = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "..", "main", "preload.js"),
    },
  });
  mainWindow.contentView.addChildView(browserView);
  browserView.webContents.loadURL("https://www.google.com");

  frameView = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "..", "main", "preload.js"),
    },
  });
  mainWindow.contentView.addChildView(frameView);
  frameView.webContents.loadFile(
    path.join(__dirname, "..", "renderer", "views", "frame.html")
  );

  botView = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "..", "main", "preload.js"),
    },
  });
  mainWindow.contentView.addChildView(botView);
  botView.webContents.loadFile(
    path.join(__dirname, "..", "renderer", "views", "bot.html")
  );

  adjustView(
    mainWindow,
    sidebarView,
    browserView,
    frameView,
    botView,
    botHeight,
    botWidth
  );

  mainWindow.on("resize", () => {
    adjustView(
      mainWindow,
      sidebarView,
      browserView,
      frameView,
      botView,
      botHeight,
      botWidth
    );
  });

  ipcDashboard.dashboard(browserView, sidebarView, frameView, botView);

  ipcMain.on("open-bot", () => {
    botHeight = 436;
    botWidth = 329;
    adjustView(
      mainWindow,
      sidebarView,
      browserView,
      frameView,
      botView,
      botHeight,
      botWidth
    );
  });

  ipcMain.on("close-bot", () => {
    botHeight = 0;
    botWidth = 0;

    adjustView(
      mainWindow,
      sidebarView,
      browserView,
      frameView,
      botView,
      botHeight,
      botWidth
    );
  });
}

ipcMain.on("browser-forward", () => {
  browserView.webContents.navigationHistory.goForward();
});
ipcMain.on("browser-back", () => {
  if (browserView.webContents.navigationHistory.canGoBack()) {
    browserView.webContents.navigationHistory.goBack();
  }
});

module.exports = {
  createDashboardView,
  getViews: () => ({ sidebarView, browserView, frameView, botView }),
};
