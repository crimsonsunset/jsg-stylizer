/**
 * Type definitions for Stylizer
 */

export type FontMode = 'curated' | 'all';
export type FontType = string; // Font config ID (e.g., 'primary', 'secondary', 'heading', etc.)

/**
 * Font information with weight and style
 */
export interface FontInfo {
  family: string;
  weight: number; // 100-900
  italic: boolean;
}

export interface FontChangedEventDetail {
  fontType: string; // Font config ID
  fontFamily: string;
  weight: number;
  italic: boolean;
  cssVariables: {
    family: string;
    weight: string;
    style: string;
  };
}

export interface FontResetEventDetail {
  fonts: Record<string, string>; // Map of font config ID to font family
}


