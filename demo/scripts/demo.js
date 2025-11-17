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
