document.getElementById("google").addEventListener("click", () => {
	window.appNavigate.go("https://www.google.com");
});

document.getElementById("facebook").addEventListener("click", () => {
	window.appNavigate.go("https://www.facebook.com");
});

document.getElementById("back").addEventListener("click", () => {
	window.electron.send("navigate-back");
});

document.getElementById("forward").addEventListener("click", () => {
	window.electron.send("navigate-forward");
});
