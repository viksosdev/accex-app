const { globalShortcut, ipcMain } = require('electron');
const { getViews } = require('../manager/dashboard');

let accesibleMode = false;
let shortcutsEnabled = true;

function setGlobalShortcuts(mainWindow) {
  const { sidebarView, browserView, frameView } = getViews();
  globalShortcut.register('CommandOrControl+I', () => {
    mainWindow.close();
    console.log('Closing app');
  });
  globalShortcut.register('CommandOrControl+I', () => {
    mainWindow.close();
    console.log('Closing app');
  });
  globalShortcut.register('Shift+Z+X', () => {
    if (shortcutsEnabled) {
      accesibleMode = !accesibleMode;
      if (accesibleMode) {
        console.log('Activar modo accesible');
        setAccesibilityShortcuts(mainWindow);
      } else {
        console.log('desactivar modo accesible');
        deleteAccesibilityShortcuts();
      }
    }
  });
}

function setAccesibilityShortcuts(mainWindow) {
  const { sidebarView, browserView, frameView } = getViews();
  globalShortcut.register('R', () => {
    console.log('Recargar browser');
    browserView.webContents.reload();
  });
  globalShortcut.register('Down', () => {
    browserView.webContents.executeJavaScript('window.scrollBy(0, 100);');
  });
  globalShortcut.register('Up', () => {
    browserView.webContents.executeJavaScript('window.scrollBy(0, -100);');
  });
  globalShortcut.register('L', () => {
    console.log('Foco siguiente');
    browserView.webContents.executeJavaScript(`
      if (window.navigationManager) {
        window.navigationManager.focusNextElement();
      }
    `);
  });
  globalShortcut.register('K', () => {
    console.log('Foco anterior');
    browserView.webContents.executeJavaScript(`
      if (window.navigationManager) {
        window.navigationManager.focusPreviousElement();
      }
    `);
  });
  globalShortcut.register('Enter', () => {
    console.log('Activar elemento');
    browserView.webContents.executeJavaScript(`
      if (window.navigationManager) {
        window.navigationManager.activateElement();
      }
    `);
  });
  globalShortcut.register('B', () => {
    console.log('Página anterior');
    browserView.webContents.goBack();
  });
  globalShortcut.register('N', () => {
    console.log('Página siguiente');
    browserView.webContents.goForward();
  });
  removeListeners(browserView);
  injectListeners(browserView);
  injectNavButtons(browserView);

  browserView.webContents.once('did-finish-load', () => {
    removeListeners(browserView);
    injectListeners(browserView);
    injectNavButtons(browserView);
  });
  browserView.webContents.on('did-navigate', () => {
    console.log('Navegación detectada. Re-inyectando lógica...');
    removeListeners(browserView);
    injectListeners(browserView);
    injectNavButtons(browserView);
  });

  // Volver a inyectar los listeners después de cada recarga
}

function injectNavButtons(browserView) {
  browserView.webContents.executeJavaScript(`
    if (!window.navigationManager) {
      window.navigationManager = {
        focusableElements: [],
        currentIndex: -1,
      };

      window.navigationManager.getFocusableElements = function () {
        return Array.from(document.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')).filter((el) => {
          return el.offsetParent !== null && !el.disabled;
        });
      };

      window.navigationManager.applyFocusStyle = function (element) {
        window.navigationManager.focusableElements.forEach((el) => {
          el.style.outline = '';
          el.style.backgroundColor = '';
        });
        if (element) {
          element.style.outline = '2px solid #007BFF';
          element.style.backgroundColor = '#D9EFFF';
        }
      };

      window.navigationManager.focusNextElement = function () {
        if (window.navigationManager.focusableElements.length === 0) return;
        window.navigationManager.currentIndex =
          (window.navigationManager.currentIndex + 1) % window.navigationManager.focusableElements.length;
        const currentElement = window.navigationManager.focusableElements[window.navigationManager.currentIndex];
        currentElement.focus();
        window.navigationManager.applyFocusStyle(currentElement);
      };

      window.navigationManager.focusPreviousElement = function () {
        if (window.navigationManager.focusableElements.length === 0) return;
        window.navigationManager.currentIndex =
          (window.navigationManager.currentIndex - 1 + window.navigationManager.focusableElements.length) %
          window.navigationManager.focusableElements.length;
        const currentElement = window.navigationManager.focusableElements[window.navigationManager.currentIndex];
        currentElement.focus();
        window.navigationManager.applyFocusStyle(currentElement);
      };

      window.navigationManager.activateElement = function () {
        if (window.navigationManager.focusableElements.length === 0) return;
        const currentElement = window.navigationManager.focusableElements[window.navigationManager.currentIndex];
        if (currentElement) {
          currentElement.click();
        }
      };
    }

    // Actualizar elementos navegables
    window.navigationManager.focusableElements = window.navigationManager.getFocusableElements();
    console.log('Elementos enfocados disponibles:', window.navigationManager.focusableElements);
  `);
}

function injectListeners(browserView) {
  browserView.webContents.executeJavaScript(`
    if (!window.shortcutListenersAdded) {
      window.shortcutListenersAdded = true;

      let isShortcutsDisabled = false;

      function isTextInputActive() {
        const activeElement = document.activeElement;

        if (['INPUT', 'TEXTAREA'].includes(activeElement.tagName)) {
          return true;
        }

        if (activeElement.isContentEditable) {
          return true;
        }

        return false;
      }

      document.addEventListener('focusin', () => {
        if (isTextInputActive() && !isShortcutsDisabled) {
          isShortcutsDisabled = true;
          window.electronAPI.send('disable-shortcuts');
        }
      });

      document.addEventListener('focusout', () => {
        if (!isTextInputActive() && isShortcutsDisabled) {
          isShortcutsDisabled = false;
          window.electronAPI.send('enable-shortcuts');
        }
      });

      document.addEventListener('keydown', (event) => {
        const activeElement = document.activeElement;

        // Detectar si está en un cuadro de texto y presiona Enter
        if (['INPUT', 'TEXTAREA'].includes(activeElement.tagName) || activeElement.isContentEditable) {
          if (event.key === 'Enter') {
            event.preventDefault(); // Evitar comportamiento predeterminado como enviar formularios
            activeElement.blur(); // Sacar el foco del cuadro de texto
            console.log('Saliste del cuadro de texto con Enter');
            window.electronAPI.send('enable-shortcuts'); // Notificar que los atajos pueden habilitarse
          }
        }
      });
    }
  `);
}

function removeListeners(browserView) {
  browserView.webContents.executeJavaScript(`
    if (window.shortcutListenersAdded) {
      window.shortcutListenersAdded = false;
      document.removeEventListener('focusin', () => {});
      document.removeEventListener('focusout', () => {});
      document.removeEventListener('keydown', () => {});
    }
  `);
}

function deleteAccesibilityShortcuts() {
  globalShortcut.unregister('R');
  globalShortcut.unregister('Down');
  globalShortcut.unregister('Up');
  globalShortcut.unregister('L');
  globalShortcut.unregister('K');
  globalShortcut.unregister('Enter');
  globalShortcut.unregister('B');
  globalShortcut.unregister('N');
}

function deleteShortcuts() {
  globalShortcut.unregisterAll();
}

ipcMain.on('disable-shortcuts', () => {
  shortcutsEnabled = false;
  deleteAccesibilityShortcuts();
  console.log('Shortcuts deshabilitados temporalmente');
});

ipcMain.on('enable-shortcuts', () => {
  shortcutsEnabled = true;
  if (accesibleMode) {
    setAccesibilityShortcuts();
  }
  console.log('Shortcuts habilitados nuevamente');
});

module.exports = {
  setGlobalShortcuts,
  deleteShortcuts,
};
