function adjustView(mainWindow, sidebarView, browserView, frameView, botView) {
	const { width, height } = mainWindow.getBounds();

	const sidebarWidth = 75;
	const frameHeight = 75;
	const botHeight = 436;
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
		width: 329,
		height: botHeight,
	});
}

module.exports = {
	adjustView,
};
