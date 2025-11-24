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
import { stylizerLogger as webComponentsLogger } from './logger.util';
import { mountSidebar } from './components/Sidebar';
import 'fontpicker/dist/fontpicker.min.css';

/**
 * Font state interface with weight and style
 * Keyed by font config ID
 */
type FontState = Record<string, FontInfo>;

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
  private fontState: FontState = {};
  private fontsInitialized: boolean = false;
  private fontPickerInstance: any = null;
  private buttonRef: HTMLElement | null = null;
  private currentFontType: FontType = 'primary';
  private currentMode: FontMode = 'curated';
  private currentCuratedFonts: string[] = CURATED_FONTS;
  private globalStyleElement: HTMLStyleElement | null = null;
  private sidebarCleanup: (() => void) | null = null;
  private originalFontState: FontInfo | null = null;
  private pickConfirmed: boolean = false;

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    webComponentsLogger.debug('Stylizer instance created');
    this.injectGlobalStyles();
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
    
    // Calculate new font state for all configured fonts
    const fontPromises: Promise<void>[] = [];
    
    for (const fontConfig of instance.config.fonts) {
      const newFontInfo: FontInfo = {
        family: fontConfig.font,
        weight: 400,
        italic: false,
      };
      
      // Check if font actually changed (or if this is first initialization)
      const existingFont = instance.fontState[fontConfig.id];
      const fontChanged = 
        !instance.fontsInitialized ||
        !existingFont ||
        existingFont.family !== newFontInfo.family ||
        existingFont.weight !== newFontInfo.weight ||
        existingFont.italic !== newFontInfo.italic;

      if (fontChanged) {
        instance.fontState[fontConfig.id] = newFontInfo;
        fontPromises.push(instance.applyFont(fontConfig.id, newFontInfo));
      }
    }

    if (fontPromises.length > 0) {
      await Promise.all(fontPromises);
      instance.fontsInitialized = true;
      webComponentsLogger.info('Stylizer configured', instance.config);
    } else {
      // Silent reconfiguration if nothing changed
      webComponentsLogger.debug('Stylizer reconfigured (no font changes)', instance.config);
    }
    
    // Mount sidebar if in browser environment
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      instance.mountSidebar();
    }
    
    return instance;
  }

  /**
   * Get current font state
   */
  public getFonts(): Record<string, FontInfo> {
    return { ...this.fontState };
  }

  /**
   * Get current configuration
   */
  public getConfig(): InternalConfig {
    return { ...this.config };
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
   * Monkey patch FontPicker to add 'select' event when font is selected in modal
   */
  private patchFontPickerSelectEvent(picker: any): void {
    const originalOpen = picker.open.bind(picker);
    let selectListeners: Array<() => void> = [];

    picker.open = async function() {
      console.log('[Stylizer] 🚀 Patched picker.open() called');
      let result;
      try {
        // Call original open - don't await, just call it
        console.log('[Stylizer] 📞 Calling originalOpen()...');
        const openResult = originalOpen();
        console.log('[Stylizer] 📞 originalOpen() returned:', typeof openResult, openResult);
        result = openResult;
        
        // Don't await - FontPicker's open() might not resolve properly
        // Instead, we'll wait for DOM to be ready
      } catch (error) {
        console.error('[Stylizer] ❌ Error calling originalOpen:', error);
        result = undefined;
      }
      
      // Wait for dialog to fully open using MutationObserver
      console.log('[Stylizer] ⏳ Waiting for fonts container to appear...');
      let fontsContainer = document.querySelector('#fp__fonts');

      // Find font container and variant panel (re-query to be sure)
      fontsContainer = document.querySelector('#fp__fonts');
      const variantsPanel = document.querySelector('#fp__variants');

      console.log('[Stylizer] ✅ FontPicker patch: Container found, attaching listeners');

      // Helper to get current variant from DOM
      const getCurrentVariant = (): { weight: number; italic: boolean } => {
        const weightInput = variantsPanel?.querySelector<HTMLInputElement>('[name=fp__weight]:checked');
        const italicInput = variantsPanel?.querySelector<HTMLInputElement>('#fp__italic');
        
        return {
          weight: weightInput ? parseInt(weightInput.value) : 400,
          italic: italicInput?.checked || false
        };
      };

      // Helper to create font object from family name and variant
      const createFontObject = (familyName: string): any => {
        try {
          const family = picker.getFamily(familyName);
          const variant = getCurrentVariant();
          
          return {
            family: {
              name: familyName,
              toString: () => familyName
            },
            weight: variant.weight,
            italic: variant.italic,
            style: variant.italic ? 'italic' : 'normal',
            variant: `${variant.weight}${variant.italic ? 'i' : ''}`
          };
        } catch (error) {
          webComponentsLogger.error('Failed to create font object for select event', { familyName, error });
          console.error('[Stylizer] Failed to create font object for select event', { familyName, error });
          return null;
        }
      };

      // Emit select event with current font info
      const emitSelectEvent = () => {
        console.log('[Stylizer] 🔍 emitSelectEvent called');
        
        // Try multiple ways to find selected font
        const selectedElement = fontsContainer.querySelector('.fp__selected[data-family]') as HTMLElement;
        console.log('[Stylizer] Selected element (via .fp__selected):', selectedElement?.getAttribute('data-family') || 'not found');
        
        // Fallback: find any element with fp__selected class
        if (!selectedElement) {
          const anySelected = fontsContainer.querySelector('.fp__selected');
          console.log('[Stylizer] Any selected element:', anySelected?.getAttribute('data-family') || 'not found');
        }

        
        const familyName = selectedElement.getAttribute('data-family');
        if (!familyName) {
          console.log('[Stylizer] ⚠️ Selected element has no data-family attribute');
          return;
        }
        
        console.log('[Stylizer] 📦 Creating font object for:', familyName);
        const font = createFontObject(familyName);
        if (font) {
          console.log('[Stylizer] ✅ Emitting select event', { family: familyName, weight: font.weight, italic: font.italic });
          webComponentsLogger.debug('Emitting select event', { family: familyName, weight: font.weight, italic: font.italic });
          picker.emit('select', font);
        } else {
          console.log('[Stylizer] ❌ Failed to create font object');
        }
      };

      // Listen for font clicks
      const onFontClick = (event: Event) => {
        const mouseEvent = event as MouseEvent;
        console.log('[Stylizer] 🖱️ Font click detected', { target: (mouseEvent.target as HTMLElement)?.tagName });
        
        const target = mouseEvent.target as HTMLElement;
        
        // Skip if clicking heart icon or anything inside it (e.g., SVG)
        if (target.closest('.fp__heart')) {
          console.log('[Stylizer] ⏭️ Skipping heart icon click');
          return;
        }
        
        const fontElement = target.closest('[data-family]') as HTMLElement;
        const clickedFamily = fontElement.getAttribute('data-family');
        console.log('[Stylizer] 📝 Font clicked:', clickedFamily);
        
        // Small delay to let the picker update its internal state and DOM
        setTimeout(() => {
          console.log('[Stylizer] ⏰ setTimeout callback executing for font:', clickedFamily);
          emitSelectEvent();
        }, 10);
      };

      // Listen for variant changes (weight/italic)
      const onVariantChange = () => {
        console.log('[Stylizer] 🔄 Variant change detected');
        setTimeout(() => {
          emitSelectEvent();
        }, 0);
      };

      fontsContainer.addEventListener('click', onFontClick, true); // Use capture phase to catch before FontPicker
      selectListeners.push(() => fontsContainer.removeEventListener('click', onFontClick, true));
      console.log('[Stylizer] ✅ Click listener attached to fonts container (capture phase)');
      
      if (variantsPanel) {
        variantsPanel.addEventListener('input', onVariantChange);
        selectListeners.push(() => variantsPanel.removeEventListener('input', onVariantChange));
        console.log('[Stylizer] ✅ Input listener attached to variants panel');
      } else {
        console.log('[Stylizer] ⚠️ Variants panel not found');
      }

      // Cleanup on close - check if modal is actually closing
      const listenersAttachedAt = Date.now();
      const onClose = () => {
        // Prevent cleanup if it happens too quickly after attaching (likely a false close event)
        const timeSinceAttach = Date.now() - listenersAttachedAt;
        const modalStillOpen = document.querySelector('.fpb__modal') !== null;
        
        // Only cleanup if modal is actually closed AND enough time has passed
        if (!modalStillOpen && timeSinceAttach > 200) {
          // Revert font if livePreview was enabled and pick was not confirmed
          if (this.config.livePreview && !this.pickConfirmed && this.originalFontState) {
            const fontTypeToRevert = this.currentFontType;
            this.applyFont(fontTypeToRevert, this.originalFontState).catch((error: unknown) => {
              webComponentsLogger.error('Failed to revert font on cancel', { fontType: fontTypeToRevert, error });
            });
          }
          
          // Clean up state
          this.originalFontState = null;
          this.pickConfirmed = false;
          
          console.log('[Stylizer] 🧹 Cleaning up select event listeners', { timeSinceAttach, modalStillOpen });
          selectListeners.forEach(cleanup => cleanup());
          selectListeners = [];
          picker.off('close', onClose);
          picker.off('closed', onClose);
        } else {
          console.log('[Stylizer] ⚠️ Close event fired but conditions not met, ignoring cleanup', { timeSinceAttach, modalStillOpen });
        }
      };
      
      picker.once('close', onClose);
      picker.once('closed', onClose);
      
      return result;
    };
  }

  /**
   * Initialize JSFontPicker
   */
  public async initializeFontPicker(fontType: FontType = 'primary', mode: FontMode = 'curated', curatedFonts?: string[]): Promise<void> {
    if (!this.buttonRef) {
      this.createHiddenButton();
    }
    
    if (!this.buttonRef) return;
    
    try {
      // Ensure global styles are injected
      this.injectGlobalStyles();
      
      // Destroy existing picker if any
      if (this.fontPickerInstance) {
        this.fontPickerInstance.destroy();
        this.fontPickerInstance = null;
      }
      
      // Dynamically import JSFontPicker
      const FontPickerModule = await import('fontpicker/dist/fontpicker.js');
      const FontPicker = FontPickerModule.default;
      
      // Find font config to get curated fonts
      const fontConfig = this.config.fonts.find(f => f.id === fontType);
      const fontsToUse = curatedFonts ?? fontConfig?.curatedFonts ?? CURATED_FONTS;
      
      // Configure based on mode
      const config: any = {
        ...FONT_PICKER_CONFIG,
        previewText: this.config.previewText,
        systemFonts: SYSTEM_FONTS,
        extraFonts: [],
      };
      
      if (mode === 'curated') {
        config.googleFonts = fontsToUse;
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
      
      // Verify picker was created successfully
      if (!picker) {
        throw new Error('Failed to create JSFontPicker instance');
      }
      
      // Monkey patch to add 'select' event
      this.patchFontPickerSelectEvent(picker);
      
      // Listen for 'select' event if livePreview is enabled (applies fonts as user browses)
      if (this.config.livePreview) {
        (picker as any).on('select', (font: any) => {
          if (font && font.family) {
            const fontInfo = {
              family: font.family.name || font.family,
              weight: font.weight || 400,
              italic: font.italic || false,
            };
            // Apply font asynchronously (don't await in event handler)
            this.applyFont(fontType, fontInfo).catch(error => {
              webComponentsLogger.error('Failed to apply font in live preview', { fontType, fontInfo, error });
            });
          }
        });
      }
      
      // Listen for font selection (when select button is clicked)
      (picker as any).on('pick', (font: any) => {
        // Mark pick as confirmed
        this.pickConfirmed = true;
        
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
      
      this.fontPickerInstance = picker;
      this.currentFontType = fontType;
      this.currentMode = mode;
      this.currentCuratedFonts = fontsToUse;
      
      webComponentsLogger.info('Picker initialized', {
        mode,
        fontType,
        fontCount: mode === 'curated' ? fontsToUse.length : 'all'
      });
    } catch (error) {
      webComponentsLogger.error('Failed to initialize FontPicker', error);
      throw error;
    }
  }

  /**
   * Wait for the picker to open by listening for the 'opened' event
   */
  private async waitForPickerOpen(): Promise<void> {
    if (!this.fontPickerInstance) {
      throw new Error('FontPicker instance not available');
    }
    
    // Listen for 'opened' event before calling open()
    // Pure event-based - no timeout fallback
    await new Promise<void>((resolve) => {
      const onOpened = () => {
        (this.fontPickerInstance as any).off('opened', onOpened);
        resolve();
      };
      
      (this.fontPickerInstance as any).on('opened', onOpened);
      
      // Open the picker (opened event will fire when DOM is ready)
      this.fontPickerInstance.open();
    });
    
    // Now DOM is guaranteed to exist - inject styles once
    this.injectGlobalStyles();
    
    // Verify styles were applied by checking if modal exists
    const modal = document.querySelector('.fpb__modal');
    if (!modal) {
      throw new Error('JSFontPicker modal DOM not found after opened event fired');
    }
  }

  /**
   * Open font picker
   */
  public async openFontPicker(fontType: FontType = 'primary', mode: FontMode = 'curated', curatedFonts?: string[]): Promise<void> {
    // Store current font state before opening picker (for cancel/revert)
    this.originalFontState = this.fontState[fontType] ? { ...this.fontState[fontType] } : null;
    this.pickConfirmed = false;
    
    // Find font config to get curated fonts
    const fontConfig = this.config.fonts.find(f => f.id === fontType);
    const fontsToUse = curatedFonts ?? fontConfig?.curatedFonts ?? CURATED_FONTS;
    
    // If same mode, type, and curated fonts, just open existing picker
    if (this.fontPickerInstance && 
        this.currentFontType === fontType && 
        this.currentMode === mode &&
        (mode === 'all' || JSON.stringify(this.currentCuratedFonts) === JSON.stringify(fontsToUse))) {
      await this.waitForPickerOpen();
      return;
    }
    
    // Otherwise, initialize with new settings
    await this.initializeFontPicker(fontType, mode, fontsToUse);
    
    // Open the picker and wait for 'opened' event
    await this.waitForPickerOpen();
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
   * Apply font to CSS variables
   */
  private async applyFont(fontType: FontType, fontInfo: FontInfo): Promise<void> {
    if (typeof document === 'undefined') return;
    
    // Find font config
    const fontConfig = this.config.fonts.find(f => f.id === fontType);
    if (!fontConfig) {
      webComponentsLogger.warn('Font config not found', { fontType });
      return;
    }
    
    // Load Google Font if needed
    await this.loadGoogleFont(fontInfo.family);
    
    const cssVars = fontConfig.cssVariables;
    
    // Build CSS values
    const fontFamilyValue = `"${fontInfo.family}", sans-serif`;
    const fontWeightValue = fontInfo.weight.toString();
    const fontStyleValue = fontInfo.italic ? 'italic' : 'normal';
    
    // Update all three CSS variables on document root
    document.documentElement.style.setProperty(cssVars.family, fontFamilyValue);
    document.documentElement.style.setProperty(cssVars.weight, fontWeightValue);
    document.documentElement.style.setProperty(cssVars.style, fontStyleValue);
    
    // Update state with full font information
    this.fontState[fontType] = {
      family: fontInfo.family,
      weight: fontInfo.weight,
      italic: fontInfo.italic,
    };
    
    webComponentsLogger.info('Font applied', {
      fontType,
      fontFamily: fontInfo.family,
      weight: fontInfo.weight,
      italic: fontInfo.italic,
      cssVariables: cssVars
    });
    
    // Emit custom event with full font information
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent<FontChangedEventDetail>('stylizer-font-changed', {
        detail: {
          fontType,
          fontFamily: fontInfo.family,
          weight: fontInfo.weight,
          italic: fontInfo.italic,
          cssVariables: cssVars
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
    const fontInfos: FontInfo[] = [];
    const resetFonts: Record<string, string> = {};
    
    // Reset all configured fonts
    for (const fontConfig of this.config.fonts) {
      const fontInfo: FontInfo = {
        family: fontConfig.font,
        weight: 400,
        italic: false,
      };
      fontInfos.push(fontInfo);
      resetFonts[fontConfig.id] = fontConfig.font;
      await this.applyFont(fontConfig.id, fontInfo);
    }
    
    // Update picker display if it exists
    if (this.fontPickerInstance) {
      const currentFontConfig = this.config.fonts.find(f => f.id === this.currentFontType);
      const defaultFont = currentFontConfig?.font ?? fontInfos[0]?.family;
      if (defaultFont) {
        this.fontPickerInstance.setFont(defaultFont);
      }
    }
    
    webComponentsLogger.info('Fonts reset', resetFonts);
    
    // Emit reset event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent<FontResetEventDetail>('stylizer-font-reset', {
        detail: {
          fonts: resetFonts
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
   * Show the sidebar (expand if collapsed)
   */
  public showSidebar(): void {
    if (typeof window === 'undefined') return;
    
    // Check if sidebar is collapsed by checking localStorage
    const STORAGE_KEY = 'stylizer-sidebar-collapsed';
    const isCollapsed = localStorage.getItem(STORAGE_KEY) === 'true';
    
    if (isCollapsed) {
      // Toggle to show (if collapsed, toggle opens it)
      window.dispatchEvent(new Event('stylizer-sidebar-toggle'));
      webComponentsLogger.debug('Sidebar shown');
    } else {
      webComponentsLogger.debug('Sidebar already visible');
    }
  }

  /**
   * Hide the sidebar (collapse if expanded)
   */
  public hideSidebar(): void {
    if (typeof window === 'undefined') return;
    
    // Check if sidebar is collapsed by checking localStorage
    const STORAGE_KEY = 'stylizer-sidebar-collapsed';
    const isCollapsed = localStorage.getItem(STORAGE_KEY) === 'true';
    
    if (!isCollapsed) {
      // Toggle to hide (if expanded, toggle closes it)
      window.dispatchEvent(new Event('stylizer-sidebar-toggle'));
      webComponentsLogger.debug('Sidebar hidden');
    } else {
      webComponentsLogger.debug('Sidebar already hidden');
    }
  }

  /**
   * Toggle sidebar visibility
   */
  public toggleSidebar(): void {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new Event('stylizer-sidebar-toggle'));
    webComponentsLogger.debug('Sidebar toggled');
  }

  /**
   * Check if sidebar is currently visible
   */
  public isSidebarVisible(): boolean {
    if (typeof window === 'undefined') return false;
    const STORAGE_KEY = 'stylizer-sidebar-collapsed';
    const isCollapsed = localStorage.getItem(STORAGE_KEY) === 'true';
    return !isCollapsed;
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
    
    // Reset instance
    Stylizer.instance = null;
    
    webComponentsLogger.debug('Stylizer destroyed');
  }
}
