const { WebContentsView } = require('electron');
const path = require('path');

function createRegisterView(mainWindow) {
  const registerView = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '..', 'main', 'preload.js'),
    },
  });
  mainWindow.contentView.addChildView(registerView);
  registerView.webContents.loadFile(
    path.join(__dirname, '..', 'renderer', 'views', 'register.html')
  );

  registerView.setBounds({
    x: 0,
    y: 0,
    width: mainWindow.getBounds().width,
    height: mainWindow.getBounds().height - 30,
  });
}

module.exports = {
  createRegisterView,
};
