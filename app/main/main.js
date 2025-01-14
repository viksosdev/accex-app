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
  path.join(__dirname, "..", "assets", "images", "Asistente_ACCEX.png", "icons", "qr.png")
);
app.dock.setIcon(appIcon);

/**
 * ==================================================
 *   1. CREACIÓN DE LA VENTANA PRINCIPAL
 * ==================================================
 */
function createAppWindow() {
  mainWindow = new BaseWindow({
    width: 1024,
    height: 600,
    minHeight: 600,
    minWidth: 1024,
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

/**
 * ==================================================
 *   2. CREACIÓN DE UNA VENTANA SECUNDARIA
 * ==================================================
 */
function createSecondaryWindow() {
  let secondaryWindow = new BaseWindow({
    width: 800,
    height: 600,
    title: "Ventana Secundaria",
    icon: appIcon,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      webSecurity: true,
    },
  });

  secondaryWindow.loadFile(
    path.join(__dirname, "..", "renderer", "views", "secondary.html")
  );

  secondaryWindow.on("closed", () => {
    secondaryWindow = null;
  });
}

/**
 * ==================================================
 *   3. FUNCIÓN PARA CAMBIAR EL TAMAÑO DE LA VENTANA
 * ==================================================
 */
function resizeMainWindow(width, height) {
  if (mainWindow) {
    mainWindow.setSize(width, height);
    mainWindow.center(); // Centrar la ventana después de cambiar el tamaño
  } else {
    console.error("mainWindow no está definido");
  }
}

/**
 * ==================================================
 *   4. INICIO DE LA APLICACIÓN
 * ==================================================
 */
function startApp() {
  createAppWindow();

  // Agregas un WebContentsView principal
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
    path.join(__dirname, "..", "renderer", "views", "index.html")
  );

  // Inicializas tu manager
  ipcManager.init(mainWindow, resizeMainWindow); // Pasar resizeMainWindow al ipcManager
}

/**
 * ==================================================
 *   5. EVENTOS DE LA APLICACIÓN
 * ==================================================
 */
app.whenReady().then(() => {
  startApp();

  // Al hacer click en el Dock (en macOS) si no hay ventanas, crea la principal
  app.on("activate", () => {
    if (BaseWindow.getAllWindows().length === 0) {
      createAppWindow();
      createDashboardView(mainWindow);
    }
  });

  // Manejo de atajos globales según el foco
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

/**
 * ==================================================
 *   6. IPC PARA ABRIR LA VENTANA SECUNDARIA
 * ==================================================
 */
ipcMain.on("open-new-window", () => {
  createSecondaryWindow();
});

// Exportar resizeMainWindow para su uso en ipcManager
module.exports = {
  resizeMainWindow,
};