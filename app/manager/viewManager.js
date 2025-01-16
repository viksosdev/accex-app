function adjustView(
  mainWindow,
  sidebarView,
  browserView,
  frameView,
  botView,
  botHeight,
  botWidth
) {
  const width = 1280;
  const height = 720;
  const sidebarWidth = 75;
  const frameHeight = 75;
  const botX = 90;

  sidebarView.setBounds({
    x: 0,
    y: frameHeight,
    width: sidebarWidth,
    height,
  });

  browserView.setBounds({
    x: sidebarWidth,
    y: frameHeight,
    width: width - sidebarWidth,
    height: height - frameHeight - 30,
  });

  frameView.setBounds({
    x: 0,
    y: 0,
    width: width,
    height: frameHeight,
  });

  botView.setBounds({
    x: botX,
    y: height - 480,
    width: botWidth,
    height: botHeight,
  });
}

module.exports = {
  adjustView,
};
