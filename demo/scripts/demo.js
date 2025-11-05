/**
 * Demo site interactivity
 */

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

themeToggle.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

// Framework tabs
const tabs = document.querySelectorAll('.tab');
const tabPanes = document.querySelectorAll('.tab-pane');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetId = tab.dataset.tab;
    
    // Update active tab
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Update active pane
    tabPanes.forEach(pane => {
      if (pane.id === targetId) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });
  });
});

// Listen to Stylizer font changes
const stylizer = document.querySelector('jsg-stylizer');
if (stylizer) {
  stylizer.addEventListener('font-changed', (e) => {
    console.log('Font changed:', e.detail);
    
    // Update demo text to show the change
    const { fontType, fontFamily } = e.detail;
    if (fontType === 'primary') {
      document.getElementById('demo-primary').textContent = `Primary Font: ${fontFamily}`;
    } else {
      document.getElementById('demo-secondary').textContent = `Secondary Font: ${fontFamily}`;
    }
  });
  
  stylizer.addEventListener('font-reset', (e) => {
    console.log('Fonts reset:', e.detail);
    document.getElementById('demo-primary').textContent = 'Primary Font Demo';
    document.getElementById('demo-secondary').textContent = 'Secondary Font Demo';
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Wait for JSG Logger to be available (async initialization)
// In v1.5.5+, window.JSG_Logger is automatically exposed when getInstance() is called
(async function checkLogger() {
  // Wait up to 2 seconds for logger to initialize
  for (let i = 0; i < 20; i++) {
    if (typeof window !== 'undefined' && window.JSG_Logger) {
      console.log('✅ JSG Logger DevTools available!');
      console.log('💡 Try: JSG_Logger.enableDevPanel()');
      console.log('📋 Available methods:', Object.keys(window.JSG_Logger));
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  console.warn('⚠️ JSG Logger not available after initialization. Make sure Stylizer component is loaded.');
})();


