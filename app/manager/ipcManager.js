const { ipcMain } = require('electron');
const { createDashboardView } = require('./dashboard');
const { createRegisterView } = require('./register');

const ipcManager = {
  init: (mainWindow) => {
    ipcMain.on('openai-query', (event, data) => {
      mainWindow.webContents.send('openai-query', data);
    });

    ipcMain.on('load-dashboard', () => {
      createDashboardView(mainWindow);
    });

    ipcMain.on('load-register', () => {
      createRegisterView(mainWindow);
    });
  },
};

module.exports = ipcManager;
