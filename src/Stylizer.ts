/**
 * Stylizer Web Component - Universal Font Picker
 */

import { ComponentState, FontMode, FontType, ThemeConfig, FontChangedEventDetail, FontResetEventDetail } from './types';
import { CURATED_FONTS, SYSTEM_FONTS, DEFAULT_CONFIG, FONT_PICKER_CONFIG } from './constants';
import { createTemplate } from './template';
import { shadowStyles, globalStyles } from './Stylizer.styles';
import JSGLogger from '@crimsonsunset/jsg-logger';

// Initialize logger once at module level
const logger = JSGLogger.getInstance({
  devtools: { enabled: true }
}).components?.webComponents || {
  info: () => {},
  debug: () => {},
  warn: () => {},
  error: () => {}
};

export class StylizerElement extends HTMLElement {
  // Shadow root
  declare shadowRoot: ShadowRoot;
  
  // State
  private state: ComponentState = {
    isOpen: false,
    mode: 'curated',
    fontType: 'primary',
    primaryFont: DEFAULT_CONFIG.primaryFont,
    secondaryFont: DEFAULT_CONFIG.secondaryFont
  };
  
  // JSFontPicker instance
  private fontPickerInstance: any = null;
  
  // DOM refs
  private buttonRef: HTMLElement | null = null;
  
  // Properties
  public curatedFonts: string[] = CURATED_FONTS;
  public systemFonts: string[] = SYSTEM_FONTS;
  public themeCSSVariables: ThemeConfig = {
    background: '--background',
    text: '--text',
    accent: '--accent',
    border: '--border',
    surface: '--surface',
    textSecondary: '--text-secondary'
  };
  
  static get observedAttributes() {
    return [
      'is-development',
      'default-primary-font',
      'default-secondary-font',
      'google-api-key',
      'preview-text',
      'css-variable-primary',
      'css-variable-secondary'
    ];
  }
  
  constructor() {
    super();
    
    // Attach shadow DOM
    this.shadowRoot = this.attachShadow({ mode: 'open' });
    
    // Bind methods
    this.render = this.render.bind(this);
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleModeClick = this.handleModeClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
  }
  
  connectedCallback() {
    logger.debug('Stylizer connected to DOM');
    
    // Inject global styles for JSFontPicker
    this.injectGlobalStyles();
    
    // Initial render
    this.render();
    
    // Attach event listeners
    this.attachEventListeners();
    
    // Hide if not in development
    if (!this.isDevelopment) {
      this.style.display = 'none';
    }
  }
  
  disconnectedCallback() {
    logger.debug('Stylizer disconnected from DOM');
    
    // Cleanup JSFontPicker
    if (this.fontPickerInstance) {
      this.fontPickerInstance.destroy();
      this.fontPickerInstance = null;
    }
    
    // Remove global styles
    const existingStyle = document.getElementById('stylizer-global-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
  }
  
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    
    logger.debug('Attribute changed', { name, oldValue, newValue });
    
    // Handle attribute changes
    switch (name) {
      case 'default-primary-font':
        this.state.primaryFont = newValue || DEFAULT_CONFIG.primaryFont;
        break;
      case 'default-secondary-font':
        this.state.secondaryFont = newValue || DEFAULT_CONFIG.secondaryFont;
        break;
      case 'is-development':
        this.style.display = this.isDevelopment ? 'inline-block' : 'none';
        break;
    }
    
    this.render();
  }
  
  /**
   * Inject global styles for JSFontPicker dialog
   */
  private injectGlobalStyles() {
    if (document.getElementById('stylizer-global-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'stylizer-global-styles';
    style.textContent = globalStyles;
    document.head.appendChild(style);
  }
  
  /**
   * Render the component
   */
  private render() {
    // Apply shadow styles
    const styleEl = document.createElement('style');
    styleEl.textContent = shadowStyles;
    
    // Generate template
    const template = createTemplate(this.state);
    
    // Update shadow DOM
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(styleEl);
    
    const container = document.createElement('div');
    container.innerHTML = template;
    this.shadowRoot.appendChild(container.firstElementChild!);
    
    // Reattach event listeners after render
    this.attachEventListeners();
  }
  
  /**
   * Attach event listeners to DOM elements
   */
  private attachEventListeners() {
    const toggleBtn = this.shadowRoot.querySelector('.toggle-btn');
    const backdrop = this.shadowRoot.querySelector('.backdrop');
    const tabs = this.shadowRoot.querySelectorAll('.tab');
    const modeButtons = this.shadowRoot.querySelectorAll('.mode-btn');
    const resetBtn = this.shadowRoot.querySelector('.reset-btn');
    this.buttonRef = this.shadowRoot.querySelector('.hidden-picker-btn');
    
    if (toggleBtn) {
      toggleBtn.addEventListener('click', this.handleToggleClick);
    }
    
    if (backdrop) {
      backdrop.addEventListener('click', this.handleBackdropClick);
    }
    
    tabs.forEach(tab => {
      tab.addEventListener('click', this.handleTabClick);
    });
    
    modeButtons.forEach(btn => {
      btn.addEventListener('click', this.handleModeClick);
    });
    
    if (resetBtn) {
      resetBtn.addEventListener('click', this.handleResetClick);
    }
  }
  
  /**
   * Handle toggle button click
   */
  private handleToggleClick() {
    this.state.isOpen = !this.state.isOpen;
    logger.debug('Toggle clicked', { isOpen: this.state.isOpen });
    this.render();
  }
  
  /**
   * Handle backdrop click
   */
  private handleBackdropClick() {
    this.close();
  }
  
  /**
   * Handle tab click
   */
  private handleTabClick(e: Event) {
    const target = e.currentTarget as HTMLElement;
    const tab = target.dataset.tab as FontType;
    
    if (tab && tab !== this.state.fontType) {
      this.state.fontType = tab;
      logger.debug('Tab changed', { fontType: tab });
      this.render();
      
      // Recreate picker for new font type
      if (this.fontPickerInstance) {
        this.fontPickerInstance.destroy();
        this.fontPickerInstance = null;
      }
    }
  }
  
  /**
   * Handle mode button click
   */
  private async handleModeClick(e: Event) {
    const target = e.currentTarget as HTMLElement;
    const newMode = target.dataset.mode as FontMode;
    
    if (!newMode) return;
    
    logger.debug('Mode button clicked', { currentMode: this.state.mode, newMode });
    
    // If same mode, just open the picker
    if (this.state.mode === newMode && this.fontPickerInstance) {
      this.fontPickerInstance.open();
      return;
    }
    
    // Different mode - update and recreate picker
    if (this.fontPickerInstance) {
      this.fontPickerInstance.destroy();
      this.fontPickerInstance = null;
    }
    
    this.state.mode = newMode;
    this.render();
    
    // Initialize picker with new mode
    await this.initializeFontPicker();
    
    // Open the picker
    setTimeout(() => {
      if (this.fontPickerInstance) {
        this.fontPickerInstance.open();
      }
    }, 100);
  }
  
  /**
   * Handle reset button click
   */
  private handleResetClick() {
    logger.debug('Reset clicked');
    this.reset();
  }
  
  /**
   * Initialize JSFontPicker
   */
  private async initializeFontPicker() {
    if (!this.buttonRef) return;
    
    try {
      // Dynamically import JSFontPicker
      const FontPickerModule = await import('fontpicker/dist/fontpicker.js');
      const FontPicker = FontPickerModule.default;
      
      // Configure based on mode
      const config: any = {
        ...FONT_PICKER_CONFIG,
        previewText: this.previewText,
        systemFonts: this.systemFonts,
        extraFonts: [],
      };
      
      if (this.state.mode === 'curated') {
        // Curated mode - use predefined list
        config.googleFonts = this.curatedFonts;
      } else {
        // Browse All mode - load all fonts
        const apiKey = this.googleApiKey;
        if (!apiKey) {
          logger.warn('Browse All mode requires API key');
          return;
        }
        config.googleFonts = null; // null = all fonts
      }
      
      // Create picker instance
      const picker = new FontPicker(this.buttonRef as any, config);
      
      // Listen for font selection
      picker.on('pick', (font: any) => {
        if (font && font.family) {
          this.applyFont(font.family.name);
        }
      });
      
      this.fontPickerInstance = picker;
      
      logger.info('Picker initialized', {
        mode: this.state.mode,
        fontCount: this.state.mode === 'curated' ? this.curatedFonts.length : 'all'
      });
    } catch (error) {
      logger.error('Failed to initialize FontPicker', error);
    }
  }
  
  /**
   * Apply font to CSS variable
   */
  private applyFont(fontFamily: string) {
    const cssVariable = this.state.fontType === 'primary' 
      ? this.cssVariablePrimary 
      : this.cssVariableSecondary;
    
    // Update CSS variable on document root
    document.documentElement.style.setProperty(
      cssVariable,
      `"${fontFamily}", sans-serif`
    );
    
    // Update state
    if (this.state.fontType === 'primary') {
      this.state.primaryFont = fontFamily;
    } else {
      this.state.secondaryFont = fontFamily;
    }
    
    // Re-render to show updated font name
    this.render();
    
    logger.info('Font applied', {
      fontType: this.state.fontType,
      fontFamily,
      cssVariable
    });
    
    // Emit custom event
    this.dispatchEvent(new CustomEvent<FontChangedEventDetail>('font-changed', {
      detail: {
        fontType: this.state.fontType,
        fontFamily,
        cssVariable
      },
      bubbles: true,
      composed: true
    }));
  }
  
  /**
   * Public API Methods
   */
  
  public open() {
    this.state.isOpen = true;
    this.render();
  }
  
  public close() {
    this.state.isOpen = false;
    this.render();
  }
  
  public reset() {
    // Reset both fonts to defaults
    this.state.primaryFont = this.defaultPrimaryFont;
    this.state.secondaryFont = this.defaultSecondaryFont;
    
    // Update CSS variables
    document.documentElement.style.setProperty(
      this.cssVariablePrimary,
      `"${this.defaultPrimaryFont}", sans-serif`
    );
    document.documentElement.style.setProperty(
      this.cssVariableSecondary,
      `"${this.defaultSecondaryFont}", sans-serif`
    );
    
    // Update picker display
    if (this.fontPickerInstance) {
      const defaultFont = this.state.fontType === 'primary' 
        ? this.defaultPrimaryFont 
        : this.defaultSecondaryFont;
      this.fontPickerInstance.setFont(defaultFont);
    }
    
    this.render();
    
    logger.info('Fonts reset', {
      primaryFont: this.defaultPrimaryFont,
      secondaryFont: this.defaultSecondaryFont
    });
    
    // Emit reset event
    this.dispatchEvent(new CustomEvent<FontResetEventDetail>('font-reset', {
      detail: {
        primaryFont: this.defaultPrimaryFont,
        secondaryFont: this.defaultSecondaryFont
      },
      bubbles: true,
      composed: true
    }));
  }
  
  /**
   * Attribute getters/setters
   */
  
  get isDevelopment(): boolean {
    const attr = this.getAttribute('is-development');
    return attr === 'true' || attr === '';
  }
  
  set isDevelopment(value: boolean) {
    if (value) {
      this.setAttribute('is-development', 'true');
    } else {
      this.removeAttribute('is-development');
    }
  }
  
  get defaultPrimaryFont(): string {
    return this.getAttribute('default-primary-font') || DEFAULT_CONFIG.primaryFont;
  }
  
  set defaultPrimaryFont(value: string) {
    this.setAttribute('default-primary-font', value);
  }
  
  get defaultSecondaryFont(): string {
    return this.getAttribute('default-secondary-font') || DEFAULT_CONFIG.secondaryFont;
  }
  
  set defaultSecondaryFont(value: string) {
    this.setAttribute('default-secondary-font', value);
  }
  
  get googleApiKey(): string {
    return this.getAttribute('google-api-key') || '';
  }
  
  set googleApiKey(value: string) {
    this.setAttribute('google-api-key', value);
  }
  
  get previewText(): string {
    return this.getAttribute('preview-text') || DEFAULT_CONFIG.previewText;
  }
  
  set previewText(value: string) {
    this.setAttribute('preview-text', value);
  }
  
  get cssVariablePrimary(): string {
    return this.getAttribute('css-variable-primary') || DEFAULT_CONFIG.cssVariablePrimary;
  }
  
  set cssVariablePrimary(value: string) {
    this.setAttribute('css-variable-primary', value);
  }
  
  get cssVariableSecondary(): string {
    return this.getAttribute('css-variable-secondary') || DEFAULT_CONFIG.cssVariableSecondary;
  }
  
  set cssVariableSecondary(value: string) {
    this.setAttribute('css-variable-secondary', value);
  }
}

