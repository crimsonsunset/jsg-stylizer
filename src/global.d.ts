/**
 * Global TypeScript declarations for @jsg/stylizer
 * 
 * Provides type support for Stylizer events
 */

// Custom event types for Stylizer
declare global {
  interface WindowEventMap {
    'stylizer-font-changed': CustomEvent<import('./types').FontChangedEventDetail>;
    'stylizer-font-reset': CustomEvent<import('./types').FontResetEventDetail>;
  }
}

export {};

