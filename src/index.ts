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

// Expose Stylizer API globally for browser console access
// Note: Explicit initialization required via Stylizer.configure()
// Similar to window.JSG_Logger pattern
if (typeof window !== 'undefined') {
  (window as any).Stylizer = {
    // Get singleton instance
    getInstance: () => Stylizer.getInstance(),
    
    // Convenience methods that work on the singleton
    showSidebar: () => Stylizer.getInstance().showSidebar(),
    hideSidebar: () => Stylizer.getInstance().hideSidebar(),
    toggleSidebar: () => Stylizer.getInstance().toggleSidebar(),
    isSidebarVisible: () => Stylizer.getInstance().isSidebarVisible(),
    
    // Font picker methods
    openFontPicker: (fontType: 'primary' | 'secondary' = 'primary', mode: 'curated' | 'all' = 'curated') => 
      Stylizer.getInstance().openFontPicker(fontType, mode),
    
    // Font management
    getFonts: () => Stylizer.getInstance().getFonts(),
    getConfig: () => Stylizer.getInstance().getConfig(),
    reset: () => Stylizer.getInstance().reset(),
    
    // Configure (reconfigure)
    configure: (config: any) => Stylizer.configure(config),
    
    // Destroy instance
    destroy: () => Stylizer.getInstance().destroy(),
  };
}

// Export Stylizer class
export { Stylizer };
export * from './types';
export * from './constants';
export * from './config';
export type { StylizerConfig, ThemeConfig, InternalConfig } from './config';
