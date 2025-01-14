const { ipcMain } = require("electron");
const { createDashboardView } = require("./dashboard");
const { createRegisterView } = require("./register");
const { createRegisterConfigView } = require("./registerConfig");

const ipcManager = {
  init: (mainWindow, resizeMainWindow) => {
    ipcMain.on("openai-query", (event, data) => {
      mainWindow.webContents.send("openai-query", data);
    });

    ipcMain.on("load-dashboard", () => {
      if (resizeMainWindow && mainWindow && !mainWindow.isDestroyed()) {
        resizeMainWindow(1280, 720, true); 
        createDashboardView(mainWindow); // Cargar el dashboard solo al recibir el evento
      } else {
        console.error("resizeMainWindow o mainWindow no está definido");
      }
    });

    ipcMain.on("load-register", () => {
      if (resizeMainWindow && mainWindow && !mainWindow.isDestroyed()) {
        resizeMainWindow(1280, 720);
        createRegisterView(mainWindow);
      } else {
        console.error("resizeMainWindow o mainWindow no está definido");
      }
    });

    ipcMain.on("load-registerConfig", () => {
      if (resizeMainWindow && mainWindow && !mainWindow.isDestroyed()) {
        resizeMainWindow(1280, 720);
        createRegisterConfigView(mainWindow);
      } else {
        console.error("resizeMainWindow o mainWindow no está definido");
      }
    });

    ipcMain.on("toggle-frame", (event, frameEnabled) => {
      if (resizeMainWindow && mainWindow && !mainWindow.isDestroyed()) {
        resizeMainWindow(mainWindow.getBounds().width, mainWindow.getBounds().height, frameEnabled);
      } else {
        console.error("resizeMainWindow o mainWindow no está definido");
      }
    });
  },
};

module.exports = ipcManager;