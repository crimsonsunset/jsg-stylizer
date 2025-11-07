/**
 * Configuration types and defaults for Stylizer
 */

import { DEFAULT_CONFIG } from './constants';

/**
 * Theme CSS variable mapping configuration
 */
export interface ThemeConfig {
  background?: string;
  text?: string;
  accent?: string;
  border?: string;
  surface?: string;
  textSecondary?: string;
}

/**
 * Main Stylizer configuration interface
 */
export interface StylizerConfig {
  fonts?: {
    primary?: string;
    secondary?: string;
  };
  cssVariables?: {
    primary?: string;
    secondary?: string;
  };
  theme?: ThemeConfig;
  googleApiKey?: string;
  previewText?: string;
}

/**
 * Internal configuration with defaults applied
 */
export interface InternalConfig {
  fonts: {
    primary: string;
    secondary: string;
  };
  cssVariables: {
    primary: string;
    secondary: string;
  };
  theme: ThemeConfig;
  googleApiKey: string;
  previewText: string;
}

/**
 * Default configuration merged with constants
 */
export const defaultConfig: InternalConfig = {
  fonts: {
    primary: DEFAULT_CONFIG.primaryFont,
    secondary: DEFAULT_CONFIG.secondaryFont,
  },
  cssVariables: {
    primary: DEFAULT_CONFIG.cssVariablePrimary,
    secondary: DEFAULT_CONFIG.cssVariableSecondary,
  },
  theme: {},
  googleApiKey: '',
  previewText: DEFAULT_CONFIG.previewText,
};

/**
 * Merge user config with defaults
 */
export function mergeConfig(userConfig: StylizerConfig = {}): InternalConfig {
  return {
    fonts: {
      primary: userConfig.fonts?.primary ?? defaultConfig.fonts.primary,
      secondary: userConfig.fonts?.secondary ?? defaultConfig.fonts.secondary,
    },
    cssVariables: {
      primary: userConfig.cssVariables?.primary ?? defaultConfig.cssVariables.primary,
      secondary: userConfig.cssVariables?.secondary ?? defaultConfig.cssVariables.secondary,
    },
    theme: {
      ...defaultConfig.theme,
      ...userConfig.theme,
    },
    googleApiKey: userConfig.googleApiKey ?? defaultConfig.googleApiKey,
    previewText: userConfig.previewText ?? defaultConfig.previewText,
  };
}

/**
 * Validate configuration
 */
export function validateConfig(config: StylizerConfig): void {
  if (config.fonts?.primary && typeof config.fonts.primary !== 'string') {
    throw new Error('fonts.primary must be a string');
  }
  if (config.fonts?.secondary && typeof config.fonts.secondary !== 'string') {
    throw new Error('fonts.secondary must be a string');
  }
  if (config.cssVariables?.primary && typeof config.cssVariables.primary !== 'string') {
    throw new Error('cssVariables.primary must be a string');
  }
  if (config.cssVariables?.secondary && typeof config.cssVariables.secondary !== 'string') {
    throw new Error('cssVariables.secondary must be a string');
  }
  if (config.googleApiKey && typeof config.googleApiKey !== 'string') {
    throw new Error('googleApiKey must be a string');
  }
  if (config.previewText && typeof config.previewText !== 'string') {
    throw new Error('previewText must be a string');
  }
}

