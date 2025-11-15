/**
 * Stylizer - Universal Font Picker
 * 
 * A config-driven font picker for experimenting with Google Fonts.
 * Works in vanilla JS, React, Vue, Svelte, Astro, and any other framework.
 * 
 * @example
 * ```javascript
 * import Stylizer from '@jsg/stylizer';
 * 
 * Stylizer.configure({
 *   fonts: { primary: 'Roboto', secondary: 'Open Sans' },
 *   cssVariables: { primary: '--font-primary', secondary: '--font-secondary' }
 * });
 * ```
 */

import { Stylizer } from './Stylizer';

// Auto-initialize with defaults if in browser environment
if (typeof window !== 'undefined') {
  // Don't await - let it initialize in background
  Stylizer.configure().catch(error => {
    console.error('Failed to initialize Stylizer:', error);
  });
}

// Export Stylizer class
export { Stylizer };
export * from './types';
export * from './constants';
export * from './config';
export type { StylizerConfig, ThemeConfig, InternalConfig } from './config';
