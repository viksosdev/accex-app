const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  toggleNavigation: () => {
    ipcRenderer.send("toggle-navigation");
  },
  onNavigationStateChange: (callback) => {
    ipcRenderer.on("navigation-state-change", callback);
  },
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
});

contextBridge.exposeInMainWorld("OpenAIApi", {
  query: (data) => {
    ipcRenderer.send("openai-query", data);
  },
});

contextBridge.exposeInMainWorld("appNavigate", {
  go: (data) => {
    if (data === "load-register-page") ipcRenderer.send("load-register");
    if (data === "load-dashboard-page") ipcRenderer.send("load-dashboard");
  },
  foward: () => {
    ipcRenderer.send("browser-forward");
  },
  back: () => {
    ipcRenderer.send("browser-back");
  },
});

contextBridge.exposeInMainWorld("navigateAPI", {
  to: (data) => {
    console.log("navigateAPI.to", data);
    ipcRenderer.send("browser-navigate", data);
  },
});

contextBridge.exposeInMainWorld("toggleNumpadShortcuts", {
  toggle: () => {
    ipcRenderer.send("toggle-numpad-shortcuts");
  },
});
