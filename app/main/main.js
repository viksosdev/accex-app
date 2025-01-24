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
const fs = require("fs");

let mainWindow;
let config = null;

function getDocumentsPath() {
  if (process.platform === "darwin") {
    return path.join(app.getPath("home"), "Documents");
  } else if (process.platform === "win32") {
    return path.join(app.getPath("userData"), "Documents");
  }

  return app.getPath("home");
}

const configPath = path.join(getDocumentsPath(), "config.json");

async function createDefaultConfig() {
  const defaultConfig = {
    language: "es",
    apiURL: "http://localhost:3000",
  };

  if (!fs.existsSync(configPath)) {
    await fs.writeFileSync(
      configPath,
      JSON.stringify(defaultConfig, null, 2),
      "utf-8"
    );
    console.log("Archivo de configuración creado");
  }
}

async function loadConfig() {
  try {
    const configData = await fs.readFileSync(configPath, "utf8");
    config = JSON.parse(configData);
  } catch (error) {
    console.error("Error al leer el archivo de configuración", error);
  }
}

const appIcon = nativeImage.createFromPath(
  path.join(
    __dirname,
    "..",
    "assets",
    "images",
    "Asistente_ACCEX.png",
    "icons",
    "qr.png"
  )
);

if (process.platform === "darwin") {
  app.dock.setIcon(appIcon);
}

/**
 * ==================================================
 *   1. CREACIÓN DE LA VENTANA PRINCIPAL
 * ==================================================
 */
function createAppWindow() {
  mainWindow = new BaseWindow({
    width: 1280,
    height: 720,
    frame: true,
    resizable: false,
    icon: appIcon,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      webSecurity: true,
    },
  });
}

/**
 * ==================================================
 *   2. CREACIÓN DE UNA VENTANA SECUNDARIA
 * ==================================================
 */
function createSecondaryWindow() {
  let secondaryWindow = new BaseWindow({
    width: 1280,
    height: 720,
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

async function initializeApp() {
  await createDefaultConfig();
  await loadConfig();
  ipcMain.handle("get-config", () => config);
}

app.whenReady().then(async () => {
  await initializeApp();
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
