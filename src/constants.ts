/**
 * Constants for Stylizer Web Component
 */

// Curated Google Fonts (alphabetically sorted)
export const CURATED_FONTS = [
  "Aldrich",
  "Anta",
  "Audiowide",
  "Bungee Inline",
  "Cabin",
  "Changa One",
  "Geostar",
  "Goldman",
  "Inter",
  "Jersey 10",
  "Kumar One Outline",
  "Michroma",
  "Nabla",
  "Nova Square",
  "Orbitron",
  "Oxanium",
  "Passero One",
  "Prosto One",
  "Quantico",
  "Revalia",
  "Righteous",
  "Roboto",
  "Rubik Doodle Triangles",
  "Rubik Glitch",
  "Russo One",
  "Sansation",
  "Share Tech Mono",
  "Silkscreen",
  "Sixtyfour",
  "Space Mono",
  "Stalinist One",
  "Syncopate",
  "Tilt Neon",
  "Tilt Prism",
  "Tomorrow",
  "VT323",
  "Zen Dots",
  "Zen Tokyo Zoo",
];

// System fonts for quick testing
export const SYSTEM_FONTS = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Verdana",
  "Trebuchet MS",
  "Comic Sans MS",
  "Impact",
  "Lucida Console",
  "Tahoma",
  "Palatino"
];

// Default configuration
export const DEFAULT_CONFIG = {
  primaryFont: "Changa One",
  secondaryFont: "Nova Square",
  previewText: "The quick brown fox jumps over the lazy dog",
  // Separate CSS variables for family, weight, and style
  cssVariablePrimaryFamily: "--font-primary-family",
  cssVariablePrimaryWeight: "--font-primary-weight",
  cssVariablePrimaryStyle: "--font-primary-style",
  cssVariableSecondaryFamily: "--font-secondary-family",
  cssVariableSecondaryWeight: "--font-secondary-weight",
  cssVariableSecondaryStyle: "--font-secondary-style",
};

// Default button configuration
export const DEFAULT_BUTTON_CONFIG = {
  preset: 'icon' as const,
};

// JSFontPicker base config
export const FONT_PICKER_CONFIG = {
  language: "en",
  font: null,
  variants: true,
  verbose: true,
  favorites: true,
  sortBy: "popularity",
  sortReverse: false,
  defaultCategories: ["sans-serif", "serif", "display", "handwriting", "monospace"],
};


