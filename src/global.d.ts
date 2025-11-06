/**
 * Global TypeScript declarations for @jsg/stylizer
 * 
 * Provides JSX and DOM API type support for the jsg-stylizer Web Component
 */

import type { StylizerElement, StylizerAttributes } from './types';

// JSX namespace augmentation for framework support (React, Vue, Astro, etc.)
declare namespace JSX {
  interface IntrinsicElements {
    'jsg-stylizer': StylizerAttributes;
  }
}

// DOM API type support
declare global {
  interface HTMLElementTagNameMap {
    'jsg-stylizer': StylizerElement;
  }
}

export {};

