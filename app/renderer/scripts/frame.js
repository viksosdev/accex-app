// Obtén el webview del DOM
const webview = document.getElementById("webview");

document.getElementById("google").addEventListener("click", () => {
	window.navigateAPI.to("https://www.google.com");
});

document.getElementById("facebook").addEventListener("click", () => {
	window.navigateAPI.to("https://www.facebook.com");
});
document.getElementById("back").addEventListener("click", () => {
	webview.goBack();
	console.log("back");
});

document.getElementById("forward").addEventListener("click", () => {
	webview.goForward();
	console.log("forward");
});
