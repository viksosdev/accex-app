// Enviar consulta de búsqueda a la API de OpenAI
document.getElementById('search-bar').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const query = event.target.value;
    window.openAIApi.query(query); // Enviar consulta
    document.getElementById('loading').style.display = 'block'; // Mostrar indicador de carga
  }
});

// Botones de navegación
document.getElementById('google').addEventListener('click', () => {
  window.navigateAPI.to('https://www.google.com');
});

document.getElementById('facebook').addEventListener('click', () => {
  window.navigateAPI.to('https://www.facebook.com');
});

document.getElementById('whatsapp').addEventListener('click', () => {
  window.navigateAPI.to('https://web.whatsapp.com');
});
