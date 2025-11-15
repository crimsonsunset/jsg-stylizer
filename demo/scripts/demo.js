/**
 * Demo site interactivity
 */

// Toggle Stylizer sidebar button
const toggleBtn = document.getElementById('toggle-stylizer-btn');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('stylizer-sidebar-toggle'));
  });
}

// Listen to Stylizer font changes via window events
window.addEventListener('stylizer-font-changed', (e) => {
  console.log('Font changed:', e.detail);
  
  // Update demo text to show the change
  const { fontType, fontFamily, weight, italic } = e.detail;
  const italicText = italic ? ' italic' : '';
  if (fontType === 'primary') {
    document.getElementById('demo-primary').textContent = `Primary Font: ${fontFamily} | ${weight}${italicText}`;
  } else {
    document.getElementById('demo-secondary').textContent = `Secondary Font: ${fontFamily} | ${weight}${italicText}`;
  }
});

window.addEventListener('stylizer-font-reset', (e) => {
  console.log('Fonts reset:', e.detail);
  document.getElementById('demo-primary').textContent = 'Primary Font: Changa One | 400';
  document.getElementById('demo-secondary').textContent = 'Secondary Font: Nova Square | 400';
});

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
