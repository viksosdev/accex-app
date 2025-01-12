const path = require("path");
const {
  app,
  BaseWindow,
  WebContentsView,
  nativeImage,
  ipcMain,
} = require("electron");
const {
  setGlobalShortcuts,
  deleteShortcuts,
} = require("../shortcuts/globalShortcuts");
const ipcManager = require("../manager/ipcManager");
const { createDashboardView } = require("../manager/dashboard");

let mainWindow;

const appIcon = nativeImage.createFromPath(
  path.join(__dirname, "..", "assets", "images", "Asistente_ACCEX.png")
);
app.dock.setIcon(appIcon);

function createAppWindow() {
  mainWindow = new BaseWindow({
    width: 1280,
    height: 720,
    minHeight: 800,
    minWidth: 1200,
    frame: true,
    icon: appIcon,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      webSecurity: true,
    },
  });

  mainWindow.setIcon(
    nativeImage.createFromPath("./assets/images/Asistente_ACCEX.png")
  );
}

function startApp() {
  createAppWindow();

  const mainView = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.contentView.addChildView(mainView);

  mainView.setBounds({
    x: 0,
    y: 0,
    width: mainWindow.getBounds().width,
    height: mainWindow.getBounds().height - 30,
  });

  mainView.webContents.loadFile(
    path.join(__dirname, "..", "renderer", "views", "register.html")
  );

  ipcManager.init(mainWindow);
}

app.whenReady().then(() => {
  startApp();

  app.on("activate", () => {
    if (BaseWindow.getAllWindows().length === 0) {
      createAppWindow();
      createDashboardView(mainWindow);
    }
  });

  mainWindow.on("focus", () => {
    setGlobalShortcuts(mainWindow);
    console.log("App focused");
  });

  mainWindow.on("blur", () => {
    deleteShortcuts();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("will-quit", () => {
  deleteShortcuts();
});
