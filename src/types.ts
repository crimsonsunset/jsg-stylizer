/**
 * Type definitions for Stylizer
 */

export type FontMode = 'curated' | 'all';
export type FontType = 'primary' | 'secondary';

/**
 * Font information with weight and style
 */
export interface FontInfo {
  family: string;
  weight: number; // 100-900
  italic: boolean;
}

export interface FontChangedEventDetail {
  fontType: FontType;
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
  primaryFont: string;
  secondaryFont: string;
}


