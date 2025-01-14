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
      if (resizeMainWindow) {
        resizeMainWindow(1280, 720); 
      } else {
        console.error("resizeMainWindow no está definido");
      }
      createDashboardView(mainWindow);
    });

    ipcMain.on("load-register", () => {
      if (resizeMainWindow) {
        resizeMainWindow(1280, 720); 
      } else {
        console.error("resizeMainWindow no está definido");
      }
      createRegisterView(mainWindow);
    });

    ipcMain.on("load-registerConfig", () => {
      if (resizeMainWindow) {
        resizeMainWindow(1280, 720); 
      } else {
        console.error("resizeMainWindow no está definido");
      }
      createRegisterConfigView(mainWindow);
    });
  },
};

module.exports = ipcManager;