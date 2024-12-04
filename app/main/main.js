const path = require('path');
const { app, BaseWindow, WebContentsView, nativeImage } = require('electron');
const {
  setGlobalShortcuts,
  deleteShortcuts,
} = require('../shortcuts/globalShortcuts');
const ipcManager = require('../manager/ipcManager');
const { createDashboardView } = require('../manager/dashboard');

let mainWindow;

const appIcon = nativeImage.createFromPath(
  path.join(__dirname, '..', 'assets', 'icons', 'qr.png')
);

function createAppWindow() {
  mainWindow = new BaseWindow({
    width: 1280,
    height: 720,
    minHeight: 800,
    minWidth: 1200,
    frame: true,
    icon: appIcon,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      webSecurity: true,
    },
  });
}

function startApp() {
  createAppWindow();

  const mainView = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
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
    path.join(__dirname, '..', 'renderer', 'views', 'index.html')
  );

  ipcManager.init(mainWindow);

  // Add listeners for custom events
  mainView.webContents.executeJavaScript(`
    const modeSwitch = document.querySelector('.toggle-switch input');
    const increaseFontBtn = document.querySelector('.option-card img[alt="Aumento de tamaño"]');
    const contrastLeftArrow = document.querySelector('.slider-arrow.left-arrow');
    const contrastRightArrow = document.querySelector('.slider-arrow.right-arrow');
    const contrastIcons = document.querySelectorAll('.contrast-icons img');
  
    let fontSizeIndex = 0;
    const fontSizes = ['16px', '18px', '20px']; // Circular font sizes
    let contrastIndex = 0;
  
    const contrastColors = [
      { background: '#FFFFFF', text: '#000000' }, // Blanco con texto negro (default en modo claro)
      { background: '#FFD700', text: '#000000' }, // Amarillo con texto negro
      { background: '#FF4500', text: '#FFFFFF' }, // Rojo oscuro con texto blanco
      { background: '#000000', text: '#FFD700' }, // Negro con texto amarillo
      { background: '#FFA500', text: '#000000' }, // Naranja con texto negro
      { background: '#FFD700', text: '#FFFFFF' }, // Amarillo claro con texto blanco
      { background: '#FF6347', text: '#FFFFFF' }, // Rojo claro con texto blanco
    ];
  
    const applyContrast = (index, isDarkMode) => {
      const colors = contrastColors[index];
      document.body.style.background = isDarkMode
        ? 'linear-gradient(to bottom, #1e1e1e, #2a2a2a)'
        : 'linear-gradient(to bottom, #f0f8ff, #dceefb)';
      document.querySelectorAll('.option-card').forEach(card => {
        card.style.background = isDarkMode ? '#333' : colors.background;
        card.style.color = isDarkMode ? '#f0f0f0' : colors.text;
      });
      document.querySelector('.controls').style.backgroundColor = isDarkMode
        ? '#2a2a2a'
        : colors.background;
      document.querySelector('.controls').style.color = isDarkMode ? '#f0f0f0' : colors.text;
    };
  
    // Initialize contrast colors
    const initializeContrast = () => {
      const isDarkMode = modeSwitch.checked;
      applyContrast(contrastIndex, isDarkMode);
    };
  
    modeSwitch.addEventListener('change', () => {
      const isDarkMode = modeSwitch.checked;
      applyContrast(contrastIndex, isDarkMode);
    });
  
    increaseFontBtn.addEventListener('click', () => {
      fontSizeIndex = (fontSizeIndex + 1) % fontSizes.length;
      document.documentElement.style.fontSize = fontSizes[fontSizeIndex];
    });
  
    contrastLeftArrow.addEventListener('click', () => {
      contrastIndex = (contrastIndex - 1 + contrastColors.length) % contrastColors.length;
      const isDarkMode = modeSwitch.checked;
      applyContrast(contrastIndex, isDarkMode);
    });
  
    contrastRightArrow.addEventListener('click', () => {
      contrastIndex = (contrastIndex + 1) % contrastColors.length;
      const isDarkMode = modeSwitch.checked;
      applyContrast(contrastIndex, isDarkMode);
    });
  
    // Initialize with default contrast (modo claro)
    initializeContrast();
  `);
}

app.whenReady().then(() => {
  startApp();

  app.on('activate', () => {
    if (BaseWindow.getAllWindows().length === 0) {
      createAppWindow();
      createDashboardView(mainWindow);
    }
  });
});

app.on('focus', () => {
  setGlobalShortcuts(mainWindow);
});

app.on('blur', () => {
  deleteShortcuts();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  deleteShortcuts();
});