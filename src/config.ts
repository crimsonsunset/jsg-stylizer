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
 * CSS variable configuration for font properties
 * All properties are required in internal config
 */
export interface FontCSSVariables {
  family: string;
  weight: string;
  style: string;
}

/**
 * User-facing CSS variable configuration (optional properties)
 */
export interface FontCSSVariablesConfig {
  family?: string;
  weight?: string;
  style?: string;
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
    primary?: FontCSSVariablesConfig | string;  // Legacy: string for backward compat, or object for separate vars
    secondary?: FontCSSVariablesConfig | string;
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
    primary: FontCSSVariables;
    secondary: FontCSSVariables;
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
    primary: {
      family: DEFAULT_CONFIG.cssVariablePrimaryFamily,
      weight: DEFAULT_CONFIG.cssVariablePrimaryWeight,
      style: DEFAULT_CONFIG.cssVariablePrimaryStyle,
    },
    secondary: {
      family: DEFAULT_CONFIG.cssVariableSecondaryFamily,
      weight: DEFAULT_CONFIG.cssVariableSecondaryWeight,
      style: DEFAULT_CONFIG.cssVariableSecondaryStyle,
    },
  },
  theme: {},
  googleApiKey: '',
  previewText: DEFAULT_CONFIG.previewText,
};

/**
 * Normalize CSS variables config (handle legacy string format)
 */
function normalizeCSSVariables(
  userValue: FontCSSVariablesConfig | string | undefined,
  defaults: FontCSSVariables
): FontCSSVariables {
  // Legacy: if string, use it as family and derive weight/style vars
  if (typeof userValue === 'string') {
    return {
      family: userValue,
      weight: `${userValue}-weight`,
      style: `${userValue}-style`,
    };
  }
  
  // New format: object with separate vars
  if (userValue && typeof userValue === 'object') {
    return {
      family: userValue.family ?? defaults.family,
      weight: userValue.weight ?? defaults.weight,
      style: userValue.style ?? defaults.style,
    };
  }
  
  // Use defaults
  return defaults;
}

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
      primary: normalizeCSSVariables(
        userConfig.cssVariables?.primary,
        defaultConfig.cssVariables.primary
      ),
      secondary: normalizeCSSVariables(
        userConfig.cssVariables?.secondary,
        defaultConfig.cssVariables.secondary
      ),
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
  
  // Validate CSS variables (string or object)
  if (config.cssVariables?.primary) {
    const primary = config.cssVariables.primary;
    if (typeof primary === 'string') {
      // Legacy string format - valid
    } else if (typeof primary === 'object') {
      if (primary.family && typeof primary.family !== 'string') {
        throw new Error('cssVariables.primary.family must be a string');
      }
      if (primary.weight && typeof primary.weight !== 'string') {
        throw new Error('cssVariables.primary.weight must be a string');
      }
      if (primary.style && typeof primary.style !== 'string') {
        throw new Error('cssVariables.primary.style must be a string');
      }
    } else {
      throw new Error('cssVariables.primary must be a string or object');
    }
  }
  
  if (config.cssVariables?.secondary) {
    const secondary = config.cssVariables.secondary;
    if (typeof secondary === 'string') {
      // Legacy string format - valid
    } else if (typeof secondary === 'object') {
      if (secondary.family && typeof secondary.family !== 'string') {
        throw new Error('cssVariables.secondary.family must be a string');
      }
      if (secondary.weight && typeof secondary.weight !== 'string') {
        throw new Error('cssVariables.secondary.weight must be a string');
      }
      if (secondary.style && typeof secondary.style !== 'string') {
        throw new Error('cssVariables.secondary.style must be a string');
      }
    } else {
      throw new Error('cssVariables.secondary must be a string or object');
    }
  }
  
  if (config.googleApiKey && typeof config.googleApiKey !== 'string') {
    throw new Error('googleApiKey must be a string');
  }
  if (config.previewText && typeof config.previewText !== 'string') {
    throw new Error('previewText must be a string');
  }
}

