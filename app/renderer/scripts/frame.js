document.getElementById("google").addEventListener("click", () => {
	window.navigateAPI.to("https://www.google.com");
});

document.getElementById("facebook").addEventListener("click", () => {
	window.navigateAPI.to("https://www.facebook.com");
});

document.getElementById("back").addEventListener("click", () => {
	window.electron.send("navigate-back");
});

document.getElementById("forward").addEventListener("click", () => {
	window.electron.send("navigate-forward");
});
