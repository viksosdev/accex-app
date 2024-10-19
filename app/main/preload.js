const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
});

contextBridge.exposeInMainWorld('OpenAIApi', {
  query: (data) => {
    ipcRenderer.send('openai-query', data);
  },
});

contextBridge.exposeInMainWorld('appNavigate', {
  go: (data) => {
    if (data === 'load-register-page') ipcRenderer.send('load-register');
    if (data === 'load-dashboard-page') ipcRenderer.send('load-dashboard');
  },
});
