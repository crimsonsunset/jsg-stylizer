/**
 * Type definitions for Stylizer Web Component
 */

export type FontMode = 'curated' | 'all';
export type FontType = 'primary' | 'secondary';

export interface ComponentState {
  isOpen: boolean;
  mode: FontMode;
  fontType: FontType;
  primaryFont: string;
  secondaryFont: string;
}

export interface ThemeConfig {
  background: string;
  text: string;
  accent: string;
  border: string;
  surface: string;
  textSecondary: string;
}

export interface FontChangedEventDetail {
  fontType: FontType;
  fontFamily: string;
  cssVariable: string;
}

export interface FontResetEventDetail {
  primaryFont: string;
  secondaryFont: string;
}

export interface ButtonConfig {
  preset?: 'icon' | 'text' | 'primary' | 'secondary';
  text?: string;
  customElement?: HTMLElement;
  ariaLabel?: string;
}

export interface StylizerAttributes {
  'is-development'?: string | boolean;
  'default-primary-font'?: string;
  'default-secondary-font'?: string;
  'google-api-key'?: string;
  'preview-text'?: string;
  'css-variable-primary'?: string;
  'css-variable-secondary'?: string;
}

export interface StylizerElement extends HTMLElement {
  // Attributes (can be set via HTML or JS)
  isDevelopment: boolean;
  defaultPrimaryFont: string;
  defaultSecondaryFont: string;
  googleApiKey: string;
  previewText: string;
  cssVariablePrimary: string;
  cssVariableSecondary: string;
  
  // Complex properties (JS only)
  curatedFonts: string[];
  systemFonts: string[];
  themeCSSVariables: ThemeConfig;
  buttonConfig: ButtonConfig;
  
  // Methods
  open(): void;
  close(): void;
  reset(): void;
}


