document.getElementById("google").addEventListener("click", () => {
  window.navigateAPI.to("https://www.google.com");
});

document.getElementById("facebook").addEventListener("click", () => {
  window.navigateAPI.to("https://www.facebook.com");
});
document.getElementById("back").addEventListener("click", () => {
  window.appNavigate.back();
  console.log("back");
});

document.getElementById("forward").addEventListener("click", () => {
  window.appNavigate.foward();
  console.log("forward");
});

const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");

// Función para manejar la búsqueda
function handleSearch() {
  const query = searchBar.value.trim(); // Elimina espacios en blanco
  const domainRegex =
    /\.(com|cl|net|es|org|io|co|edu|gov|uk|de|fr|cn|ru|jp|in|it|br|ca|au|us)$/i;

  if (domainRegex.test(query)) {
    // Si contiene una extensión de dominio válida, redirige al sitio
    const url =
      query.startsWith("http://") || query.startsWith("https://")
        ? query
        : `http://${query}`;
    window.navigateAPI.to(url);
    searchBar.value = url;
  } else {
    // Si no contiene una extensión válida, realiza una búsqueda en Google
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      query
    )}`;
    window.navigateAPI.to(googleSearchUrl);
    searchBar.value = googleSearchUrl;
  }
}

// Evento para el botón de búsqueda
searchButton.addEventListener("click", handleSearch);

// Evento para la tecla "Enter" en el campo de búsqueda
searchBar.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    handleSearch();
  }
});

searchBar.addEventListener("focus", () => {
  window.electronAPI.send("disable-shortcuts");
});

searchBar.addEventListener("blur", () => {
  window.electronAPI.send("enable-shortcuts");
});
