const { WebContentsView } = require("electron");
const path = require("path");
const { setGlobalShortcuts, deleteShortcuts } = require("../shortcuts/globalShortcuts");
const ipcManager = require("../manager/ipcManager");

function createRegisterConfigView(mainWindow) {
  // Crear la vista de configuración de registro
  const registerConfigView = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "..", "main", "preload.js"),
    },
  });

  // Añadir la vista al contenido de la ventana principal
  mainWindow.contentView.addChildView(registerConfigView);

  // Ajustar el tamaño y posición de la vista
  registerConfigView.setBounds({
    x: 0,
    y: 0,
    width: mainWindow.getBounds().width,
    height: mainWindow.getBounds().height - 30,
  });

  // Cargar el archivo HTML de configuración de registro
  registerConfigView.webContents.loadFile(
    path.join(__dirname, "..", "renderer", "views", "registerConfig.html")
  );

  // Validar que ipcManager tenga la función init
  if (typeof ipcManager.init === "function") {
    ipcManager.init(mainWindow); // Inicializar ipcManager si está disponible
  } else {
    console.warn("ipcManager.init no está disponible o no es una función.");
  }

  // Añadir atajos de teclado
  mainWindow.on("focus", () => {
    setGlobalShortcuts(mainWindow);
  });

  mainWindow.on("blur", () => {
    deleteShortcuts();
  });

  // Ejecutar lógica avanzada dentro del contexto de la vista
  registerConfigView.webContents.executeJavaScript(`
    const modeSwitch = document.querySelector('.toggle-switch input');
    const increaseFontBtn = document.querySelector('.option-card img[alt="Aumento de tamaño"]');
    const contrastLeftArrow = document.querySelector('.slider-arrow.left-arrow');
    const contrastRightArrow = document.querySelector('.slider-arrow.right-arrow');
    const contrastIcons = document.querySelectorAll('.contrast-icons img');

    let fontSizeIndex = 0;
    const fontSizes = ['16px', '18px', '20px']; // Tamaños de fuente
    let contrastIndex = 0;

    const contrastColors = [
      { background: '#FFFFFF', text: '#000000' },
      { background: '#FFD700', text: '#000000' },
      { background: '#FF4500', text: '#FFFFFF' },
      { background: '#000000', text: '#FFD700' },
      { background: '#FFA500', text: '#000000' },
      { background: '#FFD700', text: '#FFFFFF' },
      { background: '#FF6347', text: '#FFFFFF' },
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

    initializeContrast();
  `);
}

module.exports = {
  createRegisterConfigView,
};