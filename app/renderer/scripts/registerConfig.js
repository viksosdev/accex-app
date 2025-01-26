document.querySelector('.save-button').addEventListener('click', () => {
    const isDarkMode = document.querySelector('.toggle-switch input').checked;
    const theme = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    window.dispatchEvent(new CustomEvent('themeChange', { detail: theme }));
    window.appNavigate.go('load-dashboard-page');
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const contrastIcons = document.querySelectorAll('.contrast-icon');
    const leftArrow = document.querySelector('.horizontal-slider .left-arrow');
    const rightArrow = document.querySelector('.horizontal-slider .right-arrow');
    const modeSwitch = document.querySelector('.toggle-switch input');
    const html = document.documentElement;
    const body = document.body;
  
    // Get contrast order from HTML structure
    const contrastOrder = Array.from(contrastIcons).map(icon => {
      const iconName = icon.src.split('/').pop().split('.')[0];
      return `ic_${iconName}`;
    });
    let currentIndex = 0;
  
    function updateTheme(themeClass) {
      // Remove all existing contrast classes
      body.classList.remove(...contrastOrder);
      html.classList.remove(...contrastOrder);
      
      // Add the new contrast class
      body.classList.add(themeClass);
      html.classList.add(themeClass);
      
      // Store the selected contrast
      localStorage.setItem('contrastClass', themeClass);
      
      // Dispatch theme change event
      window.dispatchEvent(new CustomEvent('themeChange', { detail: themeClass }));
    }
  
    function updateActiveIcon(direction) {
      // First, remove active class from all icons
      contrastIcons.forEach(icon => icon.classList.remove('active'));
      
      // Update index based on direction
      if (direction === 'right') {
        currentIndex = (currentIndex + 1) % contrastOrder.length;
      } else {
        currentIndex = (currentIndex - 1 + contrastOrder.length) % contrastOrder.length;
      }
      
      // Add active class to new icon
      contrastIcons[currentIndex].classList.add('active');
  
      // Apply theme using the HTML order
      updateTheme(contrastOrder[currentIndex]);
    }
  
    // Initialize with saved contrast class
    const savedTheme = localStorage.getItem('contrastClass') || 'ic_3';
    if (savedTheme) {
      currentIndex = Math.max(0, contrastOrder.indexOf(savedTheme));
      updateTheme(savedTheme);
      contrastIcons[currentIndex].classList.add('active');
    }
  
    // Event listeners for arrows
    leftArrow.addEventListener('click', () => updateActiveIcon('left'));
    rightArrow.addEventListener('click', () => updateActiveIcon('right'));
  
    // Handle dark mode toggle
    modeSwitch.addEventListener('change', () => {
      const isDarkMode = modeSwitch.checked;
      if (isDarkMode) {
        html.classList.add('dark-mode');
        body.classList.add('dark-mode');
      } else {
        html.classList.remove('dark-mode');
        body.classList.remove('dark-mode');
      }
      localStorage.setItem('darkMode', isDarkMode);
    });
  
    // Initialize dark mode from saved state
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
      modeSwitch.checked = true;
      html.classList.add('dark-mode');
      body.classList.add('dark-mode');
    }
  });