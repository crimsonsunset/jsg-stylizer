/**
 * Configuration types and defaults for Stylizer
 */

import { DEFAULT_CONFIG, CURATED_FONTS } from './constants';

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
 * Font configuration for a single font picker
 */
export interface FontConfig {
  id: string; // unique identifier (e.g., 'primary', 'secondary', 'heading', 'body')
  font: string; // default font family
  cssVariables: FontCSSVariablesConfig;
  curatedFonts?: string[]; // optional curated list (defaults to CURATED_FONTS)
  label?: string; // display name (defaults to id)
}

/**
 * Internal font configuration with all defaults applied
 */
export interface InternalFontConfig {
  id: string;
  font: string;
  cssVariables: FontCSSVariables;
  curatedFonts: string[];
  label: string;
}

/**
 * Main Stylizer configuration interface
 */
export interface StylizerConfig {
  fonts?: FontConfig[] | {
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
  fonts: InternalFontConfig[];
  theme: ThemeConfig;
  googleApiKey: string;
  previewText: string;
}

/**
 * Default configuration merged with constants
 */
export const defaultConfig: InternalConfig = {
  fonts: [
    {
      id: 'primary',
      font: DEFAULT_CONFIG.primaryFont,
      cssVariables: {
        family: DEFAULT_CONFIG.cssVariablePrimaryFamily,
        weight: DEFAULT_CONFIG.cssVariablePrimaryWeight,
        style: DEFAULT_CONFIG.cssVariablePrimaryStyle,
      },
      curatedFonts: CURATED_FONTS,
      label: 'Primary Font',
    },
    {
      id: 'secondary',
      font: DEFAULT_CONFIG.secondaryFont,
      cssVariables: {
        family: DEFAULT_CONFIG.cssVariableSecondaryFamily,
        weight: DEFAULT_CONFIG.cssVariableSecondaryWeight,
        style: DEFAULT_CONFIG.cssVariableSecondaryStyle,
      },
      curatedFonts: CURATED_FONTS,
      label: 'Secondary Font',
    },
  ],
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
 * Convert legacy config format to array format
 */
function convertLegacyConfig(userConfig: StylizerConfig): FontConfig[] {
  // If already array format, return as-is
  if (Array.isArray(userConfig.fonts)) {
    return userConfig.fonts;
  }

  // Legacy format: convert to array
  const fonts: FontConfig[] = [];
  
  if (userConfig.fonts?.primary) {
    const cssVars = normalizeCSSVariables(
      userConfig.cssVariables?.primary,
      {
        family: DEFAULT_CONFIG.cssVariablePrimaryFamily,
        weight: DEFAULT_CONFIG.cssVariablePrimaryWeight,
        style: DEFAULT_CONFIG.cssVariablePrimaryStyle,
      }
    );
    fonts.push({
      id: 'primary',
      font: userConfig.fonts.primary,
      cssVariables: {
        family: cssVars.family,
        weight: cssVars.weight,
        style: cssVars.style,
      },
      curatedFonts: CURATED_FONTS,
      label: 'Primary Font',
    });
  }
  
  if (userConfig.fonts?.secondary) {
    const cssVars = normalizeCSSVariables(
      userConfig.cssVariables?.secondary,
      {
        family: DEFAULT_CONFIG.cssVariableSecondaryFamily,
        weight: DEFAULT_CONFIG.cssVariableSecondaryWeight,
        style: DEFAULT_CONFIG.cssVariableSecondaryStyle,
      }
    );
    fonts.push({
      id: 'secondary',
      font: userConfig.fonts.secondary,
      cssVariables: {
        family: cssVars.family,
        weight: cssVars.weight,
        style: cssVars.style,
      },
      curatedFonts: CURATED_FONTS,
      label: 'Secondary Font',
    });
  }
  
  return fonts.length > 0 ? fonts : defaultConfig.fonts;
}

/**
 * Merge user config with defaults
 */
export function mergeConfig(userConfig: StylizerConfig = {}): InternalConfig {
  const fontConfigs = convertLegacyConfig(userConfig);
  
  // Merge each font config with defaults
  const mergedFonts: InternalFontConfig[] = fontConfigs.map((fontConfig) => {
    const defaultFont = defaultConfig.fonts.find(f => f.id === fontConfig.id);
    
    return {
      id: fontConfig.id,
      font: fontConfig.font,
      cssVariables: {
        family: fontConfig.cssVariables.family ?? defaultFont?.cssVariables.family ?? `--font-${fontConfig.id}`,
        weight: fontConfig.cssVariables.weight ?? defaultFont?.cssVariables.weight ?? `--font-${fontConfig.id}-weight`,
        style: fontConfig.cssVariables.style ?? defaultFont?.cssVariables.style ?? `--font-${fontConfig.id}-style`,
      },
      curatedFonts: fontConfig.curatedFonts ?? defaultFont?.curatedFonts ?? CURATED_FONTS,
      label: fontConfig.label ?? defaultFont?.label ?? fontConfig.id,
    };
  });
  
  return {
    fonts: mergedFonts.length > 0 ? mergedFonts : defaultConfig.fonts,
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
  // Validate array format
  if (Array.isArray(config.fonts)) {
    config.fonts.forEach((fontConfig, index) => {
      if (!fontConfig.id || typeof fontConfig.id !== 'string') {
        throw new Error(`fonts[${index}].id must be a non-empty string`);
      }
      if (!fontConfig.font || typeof fontConfig.font !== 'string') {
        throw new Error(`fonts[${index}].font must be a non-empty string`);
      }
      if (fontConfig.cssVariables) {
        if (fontConfig.cssVariables.family && typeof fontConfig.cssVariables.family !== 'string') {
          throw new Error(`fonts[${index}].cssVariables.family must be a string`);
        }
        if (fontConfig.cssVariables.weight && typeof fontConfig.cssVariables.weight !== 'string') {
          throw new Error(`fonts[${index}].cssVariables.weight must be a string`);
        }
        if (fontConfig.cssVariables.style && typeof fontConfig.cssVariables.style !== 'string') {
          throw new Error(`fonts[${index}].cssVariables.style must be a string`);
        }
      }
      if (fontConfig.curatedFonts && !Array.isArray(fontConfig.curatedFonts)) {
        throw new Error(`fonts[${index}].curatedFonts must be an array`);
      }
      if (fontConfig.label && typeof fontConfig.label !== 'string') {
        throw new Error(`fonts[${index}].label must be a string`);
      }
    });
  }
  // Validate legacy format
  else if (config.fonts && typeof config.fonts === 'object') {
    if (config.fonts.primary && typeof config.fonts.primary !== 'string') {
      throw new Error('fonts.primary must be a string');
    }
    if (config.fonts.secondary && typeof config.fonts.secondary !== 'string') {
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
  }
  
  if (config.googleApiKey && typeof config.googleApiKey !== 'string') {
    throw new Error('googleApiKey must be a string');
  }
  if (config.previewText && typeof config.previewText !== 'string') {
    throw new Error('previewText must be a string');
  }
}

