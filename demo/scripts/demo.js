/**
 * Demo site interactivity
 */

// Theme toggle (keeping for potential future use, but gradient background is always dark)
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    // Theme toggle disabled - using gradient background
    console.log('Theme toggle disabled - using gradient background');
  });
}

// Listen to Stylizer font changes
const stylizer = document.querySelector('jsg-stylizer');
if (stylizer) {
  // Configure button via buttonConfig property
  stylizer.buttonConfig = {
    preset: 'primary',
    text: 'Click here to change fonts'
  };
  
  stylizer.addEventListener('font-changed', (e) => {
    console.log('Font changed:', e.detail);
    
    // Update demo text to show the change
    const { fontType, fontFamily } = e.detail;
    if (fontType === 'primary') {
      document.getElementById('demo-primary').textContent = `this is your primary font`;
    } else {
      document.getElementById('demo-secondary').textContent = `this is your secondary font`;
    }
  });
  
  stylizer.addEventListener('font-reset', (e) => {
    console.log('Fonts reset:', e.detail);
    document.getElementById('demo-primary').textContent = 'this is your primary font';
    document.getElementById('demo-secondary').textContent = 'this is your secondary font';
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


