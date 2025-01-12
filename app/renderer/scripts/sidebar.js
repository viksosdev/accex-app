const botButton = document.getElementById("bot");

botButton.addEventListener("click", () => {
  window.electronAPI.send("open-bot");
});
