function navigateTo(browserView, data) {
  // Navigate to a new page
  console.log(data);
  browserView.webContents.loadURL(data);
}

module.exports = {
  navigateTo,
};
