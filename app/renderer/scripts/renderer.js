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

document.addEventListener('DOMContentLoaded', () => {
  // Function to update image filters based on theme
  function updateImageFilters() {
    const currentTheme = document.documentElement.className;
    document.querySelectorAll('.sidebutton img:not(#assistant)').forEach(img => {
      img.style.transition = 'filter 0.3s ease';
    });
  }

  // Call on load and theme changes
  updateImageFilters();
  window.addEventListener('themeChange', updateImageFilters);
});
