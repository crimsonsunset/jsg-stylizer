/**
 * Type definitions for Stylizer
 */

export type FontMode = 'curated' | 'all';
export type FontType = 'primary' | 'secondary';

export interface FontChangedEventDetail {
  fontType: FontType;
  fontFamily: string;
  cssVariable: string;
}

export interface FontResetEventDetail {
  primaryFont: string;
  secondaryFont: string;
}


