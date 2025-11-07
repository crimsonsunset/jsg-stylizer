/**
 * Stylizer - Main orchestrator class for font picker functionality
 * 
 * Singleton pattern with config-driven API
 */

import type { FontType, FontChangedEventDetail, FontResetEventDetail, FontInfo } from './types';
import { CURATED_FONTS, SYSTEM_FONTS, FONT_PICKER_CONFIG } from './constants';
import { globalStyles } from './Stylizer.styles';
import type { StylizerConfig, InternalConfig } from './config';
import { mergeConfig, validateConfig, defaultConfig } from './config';
import JSGLogger from '@crimsonsunset/jsg-logger';
import { mountSidebar } from './components/Sidebar';

// Initialize logger once at module level
const loggerInstance = JSGLogger.getInstanceSync({
  devtools: { enabled: true }
});

const webComponentsLogger = loggerInstance.getComponent('webComponents');

/**
 * Font state interface with weight and style
 */
interface FontState {
  primary: {
    family: string;
    weight: number;
    italic: boolean;
  };
  secondary: {
    family: string;
    weight: number;
    italic: boolean;
  };
}

/**
 * Font picker mode
 */
type FontMode = 'curated' | 'all';

/**
 * Main Stylizer class - Singleton pattern
 */
export class Stylizer {
  private static instance: Stylizer | null = null;
  private config: InternalConfig = defaultConfig;
  private fontState: FontState = {
    primary: {
      family: defaultConfig.fonts.primary,
      weight: 400,
      italic: false,
    },
    secondary: {
      family: defaultConfig.fonts.secondary,
      weight: 400,
      italic: false,
    },
  };
  private fontPickerInstance: any = null;
  private buttonRef: HTMLElement | null = null;
  private currentFontType: FontType = 'primary';
  private currentMode: FontMode = 'curated';
  private globalStyleElement: HTMLStyleElement | null = null;
  private fontPickerCSSLink: HTMLLinkElement | HTMLStyleElement | null = null;
  private sidebarCleanup: (() => void) | null = null;

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    webComponentsLogger.debug('Stylizer instance created');
    this.injectGlobalStyles();
    // CSS will be injected when font picker is initialized
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): Stylizer {
    if (!Stylizer.instance) {
      Stylizer.instance = new Stylizer();
    }
    return Stylizer.instance;
  }

  /**
   * Configure Stylizer with user options
   */
  public static async configure(config: StylizerConfig = {}): Promise<Stylizer> {
    validateConfig(config);
    const instance = Stylizer.getInstance();
    instance.config = mergeConfig(config);
    
    // Update font state with new defaults
    instance.fontState = {
      primary: {
        family: instance.config.fonts.primary,
        weight: 400,
        italic: false,
      },
      secondary: {
        family: instance.config.fonts.secondary,
        weight: 400,
        italic: false,
      },
    };
    
    // Apply fonts to CSS variables
    await Promise.all([
      instance.applyFont('primary', instance.fontState.primary),
      instance.applyFont('secondary', instance.fontState.secondary)
    ]);
    
    // Mount sidebar if in browser environment
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      instance.mountSidebar();
    }
    
    webComponentsLogger.info('Stylizer configured', instance.config);
    return instance;
  }

  /**
   * Get current font state
   */
  public getFonts(): FontState {
    return { ...this.fontState };
  }

  /**
   * Get current configuration
   */
  public getConfig(): InternalConfig {
    return { ...this.config };
  }

  /**
   * Inject JSFontPicker CSS from node_modules
   */
  private injectFontPickerCSS(): void {
    if (typeof document === 'undefined') return;
    
    // Check if already injected
    if (document.getElementById('stylizer-fontpicker-css')) {
      return;
    }
    
    // Create link element to load CSS
    // In Vite dev mode, we can use the node_modules path
    // In production build, Vite will handle asset URLs
    const link = document.createElement('link');
    link.id = 'stylizer-fontpicker-css';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    
    // Try to use Vite's asset handling - works in dev mode
    // For production, this will need to be handled differently
    // or the CSS should be imported at build time
    const cssPath = '/node_modules/fontpicker/dist/fontpicker.min.css';
    link.href = cssPath;
    
    // Handle load/error events
    link.onload = () => {
      webComponentsLogger.debug('JSFontPicker CSS loaded');
    };
    link.onerror = () => {
      webComponentsLogger.warn('Failed to load JSFontPicker CSS from', cssPath);
      // Try alternative path or fallback
    };
    
    document.head.appendChild(link);
    this.fontPickerCSSLink = link;
    
    webComponentsLogger.debug('JSFontPicker CSS link injected');
  }

  /**
   * Inject global styles for JSFontPicker dialog
   */
  private injectGlobalStyles(): void {
    if (typeof document === 'undefined') return;
    
    let style = document.getElementById('stylizer-global-styles') as HTMLStyleElement;
    
    if (!style) {
      style = document.createElement('style');
      style.id = 'stylizer-global-styles';
      document.head.appendChild(style);
      this.globalStyleElement = style;
    }
    
    style.textContent = globalStyles;
    
    // Move to end of head to ensure it's last (highest priority)
    if (style.parentNode) {
      style.remove();
      document.head.appendChild(style);
    }
  }

  /**
   * Create hidden button element for JSFontPicker attachment
   */
  private createHiddenButton(): HTMLElement {
    if (typeof document === 'undefined') {
      throw new Error('Document is not available');
    }
    
    if (!this.buttonRef) {
      const button = document.createElement('button');
      button.style.display = 'none';
      button.setAttribute('aria-hidden', 'true');
      document.body.appendChild(button);
      this.buttonRef = button;
    }
    
    return this.buttonRef;
  }

  /**
   * Initialize JSFontPicker
   */
  public async initializeFontPicker(fontType: FontType = 'primary', mode: FontMode = 'curated'): Promise<void> {
    if (!this.buttonRef) {
      this.createHiddenButton();
    }
    
    if (!this.buttonRef) return;
    
    try {
      // Ensure CSS is injected first
      this.injectFontPickerCSS();
      
      // Ensure global styles are injected
      this.injectGlobalStyles();
      
      // Destroy existing picker if any
      if (this.fontPickerInstance) {
        this.fontPickerInstance.destroy();
        this.fontPickerInstance = null;
      }
      
      // Wait a bit for CSS to load before initializing picker
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Dynamically import JSFontPicker
      const FontPickerModule = await import('fontpicker/dist/fontpicker.js');
      const FontPicker = FontPickerModule.default;
      
      // Configure based on mode
      const config: any = {
        ...FONT_PICKER_CONFIG,
        previewText: this.config.previewText,
        systemFonts: SYSTEM_FONTS,
        extraFonts: [],
      };
      
      if (mode === 'curated') {
        config.googleFonts = CURATED_FONTS;
      } else {
        const apiKey = this.config.googleApiKey;
        if (!apiKey) {
          webComponentsLogger.warn('Browse All mode requires API key');
          throw new Error('Browse All mode requires a Google Fonts API key');
        }
        config.googleFonts = null; // null = all fonts
      }
      
      // Create picker instance
      const picker = new FontPicker(this.buttonRef as any, config);
      
      // Re-inject styles after picker creates its DOM
      setTimeout(() => {
        this.injectGlobalStyles();
      }, 100);
      
      // Listen for font selection
      (picker as any).on('pick', (font: any) => {
        if (font && font.family) {
          // Capture full font information including weight and italic
          const fontInfo = {
            family: font.family.name,
            weight: font.weight || 400,
            italic: font.italic || false,
          };
          // Apply font asynchronously (don't await in event handler)
          this.applyFont(fontType, fontInfo).catch(error => {
            webComponentsLogger.error('Failed to apply font', { fontType, fontInfo, error });
          });
        }
      });
      
      // Re-inject styles after picker is created
      setTimeout(() => {
        this.injectGlobalStyles();
      }, 200);
      
      this.fontPickerInstance = picker;
      this.currentFontType = fontType;
      this.currentMode = mode;
      
      webComponentsLogger.info('Picker initialized', {
        mode,
        fontType,
        fontCount: mode === 'curated' ? CURATED_FONTS.length : 'all'
      });
    } catch (error) {
      webComponentsLogger.error('Failed to initialize FontPicker', error);
      throw error;
    }
  }

  /**
   * Open font picker
   */
  public async openFontPicker(fontType: FontType = 'primary', mode: FontMode = 'curated'): Promise<void> {
    // If same mode and type, just open existing picker
    if (this.fontPickerInstance && this.currentFontType === fontType && this.currentMode === mode) {
      this.fontPickerInstance.open();
      return;
    }
    
    // Otherwise, initialize with new settings
    await this.initializeFontPicker(fontType, mode);
    
    // Open the picker
    setTimeout(() => {
      if (this.fontPickerInstance) {
        this.fontPickerInstance.open();
      }
    }, 100);
  }

  /**
   * Load Google Font if it's not a system font
   */
  private async loadGoogleFont(fontFamily: string): Promise<void> {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    // Skip system fonts
    if (SYSTEM_FONTS.includes(fontFamily)) {
      return;
    }
    
    try {
      // Dynamically import FontPicker to access FontLoader
      const FontPickerModule = await import('fontpicker/dist/fontpicker.js');
      const FontPicker = FontPickerModule.default;
      
      // Check if font is already loaded
      if (FontPicker.FontLoader.loaded(fontFamily)) {
        webComponentsLogger.debug('Font already loaded', { fontFamily });
        return;
      }
      
      // Load the font
      await FontPicker.FontLoader.load(fontFamily);
      webComponentsLogger.debug('Font loaded', { fontFamily });
    } catch (error) {
      webComponentsLogger.warn('Failed to load font', { fontFamily, error });
      // Don't throw - allow fallback to system fonts
    }
  }

  /**
   * Apply font to CSS variable
   */
  private async applyFont(fontType: FontType, fontInfo: FontInfo): Promise<void> {
    if (typeof document === 'undefined') return;
    
    // Load Google Font if needed
    await this.loadGoogleFont(fontInfo.family);
    
    const cssVariable = fontType === 'primary' 
      ? this.config.cssVariables.primary 
      : this.config.cssVariables.secondary;
    
    // Build CSS font value with weight and style
    const fontStyle = fontInfo.italic ? 'italic' : 'normal';
    const cssValue = `"${fontInfo.family}", sans-serif`;
    
    // Update CSS variable on document root (family only for now)
    // Note: Weight and italic are stored in state but not in CSS variable
    // CSS variables don't support font-weight/font-style directly
    document.documentElement.style.setProperty(cssVariable, cssValue);
    
    // Update state with full font information
    if (fontType === 'primary') {
      this.fontState.primary = {
        family: fontInfo.family,
        weight: fontInfo.weight,
        italic: fontInfo.italic,
      };
    } else {
      this.fontState.secondary = {
        family: fontInfo.family,
        weight: fontInfo.weight,
        italic: fontInfo.italic,
      };
    }
    
    webComponentsLogger.info('Font applied', {
      fontType,
      fontFamily: fontInfo.family,
      weight: fontInfo.weight,
      italic: fontInfo.italic,
      cssVariable
    });
    
    // Emit custom event with full font information
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent<FontChangedEventDetail>('stylizer-font-changed', {
        detail: {
          fontType,
          fontFamily: fontInfo.family,
          weight: fontInfo.weight,
          italic: fontInfo.italic,
          cssVariable
        },
        bubbles: true,
        composed: true
      }));
    }
  }

  /**
   * Reset fonts to defaults
   */
  public async reset(): Promise<void> {
    const primaryFontInfo: FontInfo = {
      family: this.config.fonts.primary,
      weight: 400,
      italic: false,
    };
    const secondaryFontInfo: FontInfo = {
      family: this.config.fonts.secondary,
      weight: 400,
      italic: false,
    };
    
    // Update CSS variables
    await Promise.all([
      this.applyFont('primary', primaryFontInfo),
      this.applyFont('secondary', secondaryFontInfo)
    ]);
    
    // Update picker display if it exists
    if (this.fontPickerInstance) {
      const defaultFont = this.currentFontType === 'primary' 
        ? primaryFontInfo.family 
        : secondaryFontInfo.family;
      this.fontPickerInstance.setFont(defaultFont);
    }
    
    webComponentsLogger.info('Fonts reset', {
      primaryFont: primaryFontInfo.family,
      secondaryFont: secondaryFontInfo.family
    });
    
    // Emit reset event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent<FontResetEventDetail>('stylizer-font-reset', {
        detail: {
          primaryFont: primaryFontInfo.family,
          secondaryFont: secondaryFontInfo.family
        },
        bubbles: true,
        composed: true
      }));
    }
  }

  /**
   * Mount sidebar component
   */
  private mountSidebar(): void {
    // Cleanup existing sidebar if any
    if (this.sidebarCleanup) {
      this.sidebarCleanup();
      this.sidebarCleanup = null;
    }
    
    // Mount new sidebar
    this.sidebarCleanup = mountSidebar(this.config, this.fontState);
    webComponentsLogger.debug('Sidebar mounted');
  }

  /**
   * Destroy instance and cleanup
   */
  public destroy(): void {
    // Cleanup sidebar
    if (this.sidebarCleanup) {
      this.sidebarCleanup();
      this.sidebarCleanup = null;
    }
    
    // Cleanup JSFontPicker
    if (this.fontPickerInstance) {
      this.fontPickerInstance.destroy();
      this.fontPickerInstance = null;
    }
    
    // Remove button ref
    if (this.buttonRef && this.buttonRef.parentNode) {
      this.buttonRef.parentNode.removeChild(this.buttonRef);
      this.buttonRef = null;
    }
    
    // Remove global styles
    if (this.globalStyleElement && this.globalStyleElement.parentNode) {
      this.globalStyleElement.parentNode.removeChild(this.globalStyleElement);
      this.globalStyleElement = null;
    }
    
    // Remove font picker CSS
    if (this.fontPickerCSSLink && this.fontPickerCSSLink.parentNode) {
      this.fontPickerCSSLink.parentNode.removeChild(this.fontPickerCSSLink);
      this.fontPickerCSSLink = null;
    }
    
    // Reset instance
    Stylizer.instance = null;
    
    webComponentsLogger.debug('Stylizer destroyed');
  }
}
