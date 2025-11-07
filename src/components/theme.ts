/**
 * Dark theme for Stylizer sidebar
 * Professional dark theme optimized for DevTools panel
 */

import { defaultTheme } from 'evergreen-ui';
import merge from 'lodash.merge';

export const darkTheme = merge({}, defaultTheme, {
  colors: {
    // Background colors
    background: {
      tint1: '#1E1E1E',      // Main panel background
      tint2: '#2A2A2A',      // Card/section backgrounds
      overlay: 'rgba(0,0,0,0.9)'  // Modal overlays
    },
    
    // Border colors
    border: {
      default: '#333333',     // Primary borders
      muted: '#2A2A2A'       // Subtle borders
    },
    
    // Text colors
    text: {
      default: '#FFFFFF',     // Primary text
      muted: '#CCCCCC',      // Secondary text
      dark: '#888888'        // Tertiary text
    },
    
    // Intent colors (for buttons)
    intent: {
      success: '#57cc99',
      warning: '#F39C12',
      danger: '#E74C3C',
      none: '#95A5A6'
    }
  }
});

