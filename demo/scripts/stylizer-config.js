/**
 * Stylizer configuration script
 * Sets up the API key from environment variables
 */

import { Stylizer } from '../../src/index.ts';

// Set API key from environment variable if available
// Supports both VITE_ prefix (Vite) and PUBLIC_ prefix (Astro)
// For Netlify, set VITE_GOOGLE_FONTS_API_KEY in environment variables
async function configureStylizer() {
  // Check for VITE_ prefix first (Vite convention), then PUBLIC_ (Astro convention)
  const apiKey = import.meta.env.VITE_GOOGLE_FONTS_API_KEY || import.meta.env.PUBLIC_GOOGLE_FONTS_API_KEY;
  
  console.log('API Key check:', {
    'VITE_GOOGLE_FONTS_API_KEY': import.meta.env.VITE_GOOGLE_FONTS_API_KEY,
    'PUBLIC_GOOGLE_FONTS_API_KEY': import.meta.env.PUBLIC_GOOGLE_FONTS_API_KEY,
    'found': !!apiKey
  });
  
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

