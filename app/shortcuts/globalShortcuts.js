const { globalShortcut } = require('electron');

function setGlobalShortcuts(mainWindow) {
  globalShortcut.register('CommandOrControl+W', () => {
    if (mainWindow.isFocused() && !mainWindow.isDestroyed()) {
      mainWindow.close();
    }
  });
}

function deleteShortcuts() {
  globalShortcut.unregisterAll();
}

module.exports = {
  setGlobalShortcuts,
  deleteShortcuts,
};
