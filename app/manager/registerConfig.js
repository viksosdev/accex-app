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
    const contrastIcons = document.querySelectorAll('.contrast-icon');
    const leftArrow = document.querySelector('.horizontal-slider .left-arrow');
    const rightArrow = document.querySelector('.horizontal-slider .right-arrow');
    const modeSwitch = document.querySelector('.toggle-switch input');
    const increaseFontBtn = document.querySelector('.option-card img[alt="Aumento de tamaño"]');

    let fontSizeIndex = 0;
    const fontSizes = ['16px', '18px', '20px'];

    // Theme mapping
    const themeMap = {
      'ic_3': '',  // default light mode
      'ic_1': 'dark-mode',
      'ic_2': 'ic_2',
      'ic_5': 'ic_5',
      'ic_7': 'ic_7',
      'ic_4': 'ic_4'
    };

    // Load saved contrast theme
    const savedContrast = localStorage.getItem('contrastTheme');
    if (savedContrast) {
      document.documentElement.className = savedContrast;
      // Update active icon
      contrastIcons.forEach(icon => {
        const iconName = icon.src.split('/').pop().split('.')[0];
        if (themeMap[iconName] === savedContrast) {
          icon.classList.add('active');
        } else {
          icon.classList.remove('active');
        }
      });
    }

    function updateActiveIcon(direction) {
      const icons = [...contrastIcons];
      const currentActiveIndex = icons.findIndex(icon => icon.classList.contains('active'));
      
      icons[currentActiveIndex].classList.remove('active');
      
      let newIndex;
      if (direction === 'right') {
        newIndex = (currentActiveIndex + 1) % icons.length;
      } else {
        newIndex = (currentActiveIndex - 1 + icons.length) % icons.length;
      }
      
      icons[newIndex].classList.add('active');

      const iconName = icons[newIndex].src.split('/').pop().split('.')[0];
      const newTheme = themeMap[iconName];
      
      document.documentElement.className = newTheme;
      localStorage.setItem('contrastTheme', newTheme);
    }

    leftArrow.addEventListener('click', () => updateActiveIcon('left'));
    rightArrow.addEventListener('click', () => updateActiveIcon('right'));

    // Handle dark mode toggle
    modeSwitch.addEventListener('change', () => {
      if (modeSwitch.checked) {
        document.documentElement.className = 'dark-mode';
        localStorage.setItem('contrastTheme', 'dark-mode');
        contrastIcons.forEach(icon => {
          const iconName = icon.src.split('/').pop().split('.')[0];
          icon.classList.toggle('active', iconName === 'ic_1');
        });
      } else {
        document.documentElement.className = '';
        localStorage.setItem('contrastTheme', '');
        contrastIcons.forEach(icon => {
          const iconName = icon.src.split('/').pop().split('.')[0];
          icon.classList.toggle('active', iconName === 'ic_3');
        });
      }
    });

    // Handle font size changes
    increaseFontBtn.addEventListener('click', () => {
      fontSizeIndex = (fontSizeIndex + 1) % fontSizes.length;
      document.documentElement.style.fontSize = fontSizes[fontSizeIndex];
    });
  `);
}

module.exports = {
  createRegisterConfigView,
};