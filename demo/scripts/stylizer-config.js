/**
 * Stylizer configuration script
 * Sets up the API key from environment variables
 */

import JSGLogger from '@crimsonsunset/jsg-logger';
import { Stylizer } from '../../src/index.ts';

// Initialize JSG Logger for demo (optional - stylizer works without it)
// Enable DevTools and set window.JSG_Logger for console access
// Define webComponents component that stylizer uses for logging
// Note: components object REPLACES defaults, so include 'core' if you want it
const loggerInstance = JSGLogger.getInstanceSync({
  devtools: { enabled: true },
  components: {
    core: {
      emoji: '🎯',
      color: '#4A90E2',
      name: 'JSG-CORE',
      level: 'info'
    },
    webComponents: {
      emoji: '📦',
      color: '#4A90E2',
      name: 'WEB-COMPONENTS',
      level: 'info'
    }
  }
});

// Set API key from environment variable if available
// Supports both VITE_ prefix (Vite) and PUBLIC_ prefix (Astro)
// For Netlify, set VITE_GOOGLE_FONTS_API_KEY in environment variables
async function configureStylizer() {
  // Check for VITE_ prefix first (Vite convention), then PUBLIC_ (Astro convention)
  const apiKey = import.meta.env.VITE_GOOGLE_FONTS_API_KEY || import.meta.env.PUBLIC_GOOGLE_FONTS_API_KEY;
  
  // Configure Stylizer with API key and CSS variables
  // Using new separate CSS variables format
  const config = {
    fonts: {
      primary: 'Changa One',
      secondary: 'Nova Square'
    },
    cssVariables: {
      primary: {
        family: '--font-primary-family',
        weight: '--font-primary-weight',
        style: '--font-primary-style'
      },
      secondary: {
        family: '--font-secondary-family',
        weight: '--font-secondary-weight',
        style: '--font-secondary-style'
      }
    },
    previewText: 'Build. Lead. Learn. JSG Tech Check.'
  };
  
  if (apiKey) {
    config.googleApiKey = apiKey;
    console.log('✅ API key configured in Stylizer');
  } else {
    console.warn('⚠️ No API key found in environment variables');
  }
  
  // Configure Stylizer (merges with existing config from auto-initialization)
  await Stylizer.configure(config);
}

// Wait for DOM to be ready, then configure
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', configureStylizer);
} else {
  configureStylizer();
}

