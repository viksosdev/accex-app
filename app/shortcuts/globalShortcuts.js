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
  globalShortcut.register('C', () => {
    //abrir ajustes
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
    browserView.webContents.navigationHistory.goBack();
  });
  globalShortcut.register('N', () => {
    console.log('Página siguiente');
    browserView.webContents.navigationHistory.goForward();
  });
  globalShortcut.register('=', () => {
    console.log('Zoom in');
    browserView.webContents.setZoomLevel(
      browserView.webContents.getZoomLevel() + 0.1
    );
  });
  globalShortcut.register('-', () => {
    console.log('Zoom out');
    browserView.webContents.setZoomLevel(
      browserView.webContents.getZoomLevel() - 0.1
    );
  });
  globalShortcut.register('0', () => {
    console.log('Zoom reset');
    browserView.webContents.setZoomLevel(0);
  });
  globalShortcut.register('1', () => {
    console.log('Sitio favorito 1');
    browserView.webContents.loadURL('https://www.google.com');
  });
  globalShortcut.register('2', () => {
    console.log('Sitio favorito 2');
    browserView.webContents.loadURL('https://www.facebook.com');
  });
  globalShortcut.register('3', () => {
    console.log('Sitio favorito 3');
    browserView.webContents.loadURL('https://www.twitter.com');
  });
  globalShortcut.register('4', () => {
    console.log('Sitio favorito 4');
    browserView.webContents.loadURL('https://www.instagram.com');
  });
  globalShortcut.register('5', () => {
    console.log('Sitio favorito 5');
    browserView.webContents.loadURL('https://www.linkedin.com');
  });
  globalShortcut.register('6', () => {
    console.log('Sitio favorito 6');
    browserView.webContents.loadURL('https://www.youtube.com');
  });
  globalShortcut.register('7', () => {
    console.log('Sitio favorito 7');
    browserView.webContents.loadURL('XXXXXXXXXXXXXXXXXXXXXXXX');
  });
  globalShortcut.register('8', () => {
    console.log('Sitio favorito 8');
    browserView.webContents.loadURL('XXXXXXXXXXXXXXXXXXXXXXXX');
  });
  globalShortcut.register('9', () => {
    console.log('Sitio favorito 9');
    browserView.webContents.loadURL('XXXXXXXXXXXXXXXXXXXXXXXX');
  });
  globalShortcut.register('G', () => {
    console.log('Ir al buscador de google');
    browserView.webContents.loadURL('https://www.google.com');
  });

  removeListeners(browserView);
  injectListeners(browserView);
  injectNavButtons(browserView);

  browserView.webContents.removeAllListeners('did-finish-load');
  browserView.webContents.once('did-finish-load', () => {
    removeListeners(browserView);
    injectListeners(browserView);
    injectNavButtons(browserView);
  });
  browserView.webContents.removeAllListeners('did-navigate');
  browserView.webContents.on('did-navigate', () => {
    console.log('Navegación completa detectada. Re-inyectando lógica...');
    removeListeners(browserView);
    injectListeners(browserView);
    injectNavButtons(browserView);
  });

  console.log(
    'Listeners actuales para did-finish-load:',
    browserView.webContents.listenerCount('did-finish-load')
  );

  browserView.webContents.setMaxListeners(20);

  browserView.webContents.on('did-navigate-in-page', () => {
    console.log(
      'Navegación dentro de la página detectada (historial). Re-inyectando lógica...'
    );
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

        if (!activeElement || activeElement.disabled || activeElement.offsetParent === null) {
          return false;
        }

        const textInputTypes = ['text', 'password', 'email', 'url', 'tel', 'search'];

        if (activeElement.tagName === 'INPUT' && textInputTypes.includes(activeElement.type || 'text')) {
          return true;
        }

        if (activeElement.tagName === 'TEXTAREA') {
          return true;
        }

        if (activeElement.isContentEditable) {
          return true;
        }

        return false;
      }

      function updateShortcutsState() {
        if (isTextInputActive() && !isShortcutsDisabled) {
          isShortcutsDisabled = true;
          window.electronAPI.send('disable-shortcuts');
        } else if (!isTextInputActive() && isShortcutsDisabled) {
          isShortcutsDisabled = false;
          window.electronAPI.send('enable-shortcuts');
        }
      }

      document.addEventListener('focusin', updateShortcutsState);
      document.addEventListener('focusout', updateShortcutsState);

      document.addEventListener('keydown', (event) => {
        const activeElement = document.activeElement;

        if (['INPUT', 'TEXTAREA'].includes(activeElement.tagName) || activeElement.isContentEditable) {
          if (event.key === 'Enter') {
            event.preventDefault();
            activeElement.blur();
            console.log('Saliste del cuadro de texto con Enter');
            window.electronAPI.send('enable-shortcuts');
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
