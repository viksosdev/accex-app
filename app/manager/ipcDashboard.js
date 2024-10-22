const { ipcMain } = require('electron');
const { navigateTo } = require('./navManager');

const ipcDashboard = {
  dashboard: (browserView, sidebarView, frameView) => {
    ipcMain.on('browser-navigate', async (event, url) => {
      await navigateTo(browserView, url);
    });
  },
};

module.exports = ipcDashboard;
