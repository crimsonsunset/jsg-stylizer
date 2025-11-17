/**
 * Global TypeScript declarations for @jsg/stylizer
 * 
 * Provides type support for Stylizer events and global window API
 */

import type { StylizerConfig } from './config';
import type { FontType, FontMode } from './types';

// Custom event types for Stylizer
declare global {
  interface WindowEventMap {
    'stylizer-font-changed': CustomEvent<import('./types').FontChangedEventDetail>;
    'stylizer-font-reset': CustomEvent<import('./types').FontResetEventDetail>;
  }

  interface Window {
    /**
     * Global Stylizer API for browser console access
     * Available as window.Stylizer after Stylizer is initialized
     */
    Stylizer?: {
      getInstance: () => import('./Stylizer').Stylizer;
      showSidebar: () => void;
      hideSidebar: () => void;
      toggleSidebar: () => void;
      isSidebarVisible: () => boolean;
      openFontPicker: (fontType?: FontType, mode?: FontMode) => Promise<void>;
      getFonts: () => { primary: import('./types').FontInfo; secondary: import('./types').FontInfo };
      getConfig: () => import('./config').InternalConfig;
      reset: () => Promise<void>;
      configure: (config: StylizerConfig) => Promise<import('./Stylizer').Stylizer>;
      destroy: () => void;
    };
  }
}

export {};

