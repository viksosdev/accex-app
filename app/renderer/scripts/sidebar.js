const botButton = document.getElementById("bot");
const configButton = document.getElementById("config-button");

botButton.addEventListener("click", () => {
  window.electronAPI.send("open-bot");
});

configButton.addEventListener("click", () => {
  window.appNavigate.go('load-registerConfig-page');
});
