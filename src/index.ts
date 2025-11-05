/**
 * Stylizer - Universal Font Picker Web Component
 * 
 * A framework-agnostic Web Component for experimenting with Google Fonts.
 * Works in vanilla JS, React, Vue, Svelte, Astro, and any other framework.
 * 
 * @example
 * ```html
 * <jsg-stylizer 
 *   is-development="true"
 *   default-primary-font="Roboto"
 *   default-secondary-font="Open Sans">
 * </jsg-stylizer>
 * ```
 */

import { StylizerElement } from './Stylizer';

// Register custom element
if (!customElements.get('jsg-stylizer')) {
  customElements.define('jsg-stylizer', StylizerElement);
}

// Export for type safety and direct usage
export { StylizerElement };
export * from './types';
export * from './constants';


