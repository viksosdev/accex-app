document.getElementById("searchButton").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value;
  window.api.sendSearchQuery(query); // Enviar la consulta al proceso principal
});

// Escuchar los resultados de la búsqueda
window.api.onSearchResult((result) => {
  const resultDiv = document.getElementById("searchResults");
  resultDiv.innerHTML = result; // Mostrar los resultados en el DOM
});

// Mostrar indicadores de carga
window.api.onLoadingStarted(() => {
  document.getElementById("loadingIndicator").style.display = "block";
});
window.api.onLoadingStopped(() => {
  document.getElementById("loadingIndicator").style.display = "none";
});
