/**
 * Stylizer Web Component - Universal Font Picker
 */

import type { ComponentState, FontMode, FontType, ThemeConfig, FontChangedEventDetail, FontResetEventDetail, ButtonConfig } from './types';
import { CURATED_FONTS, SYSTEM_FONTS, DEFAULT_CONFIG, FONT_PICKER_CONFIG, DEFAULT_BUTTON_CONFIG } from './constants';
import { createTemplate } from './template';
import { shadowStyles, globalStyles } from './Stylizer.styles';
import JSGLogger from '@crimsonsunset/jsg-logger';

// Initialize logger once at module level
// Use getInstanceSync for synchronous access - getComponent is always available
const loggerInstance = JSGLogger.getInstanceSync({
  devtools: { enabled: true }
});

// Cache webComponents logger - getComponent always returns a logger instance
// Called once at module load, safe because getComponent handles all edge cases
const webComponentsLogger = loggerInstance.getComponent('webComponents');

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
  
  // Private properties
  private _buttonConfig: ButtonConfig = { ...DEFAULT_BUTTON_CONFIG };
  
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
  
  get buttonConfig(): ButtonConfig {
    return this._buttonConfig;
  }
  
  set buttonConfig(value: ButtonConfig) {
    this._buttonConfig = { ...value };
    // Trigger re-render if component is already connected
    if (this.isConnected) {
      this.render();
    }
  }
  
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
    
    // Attach shadow DOM (shadowRoot is automatically set by attachShadow)
    this.attachShadow({ mode: 'open' });
    
    // Bind methods
    this.render = this.render.bind(this);
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleModeClick = this.handleModeClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
  }
  
  connectedCallback() {
    webComponentsLogger.debug('Stylizer connected to DOM');
    
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
    webComponentsLogger.debug('Stylizer disconnected from DOM');
    
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
    
    webComponentsLogger.debug('Attribute changed', { name, oldValue, newValue });
    
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
      case 'google-api-key':
        // API key changed - re-render to update Browse All button state
        // Also destroy picker if it exists and we're in Browse All mode
        if (this.fontPickerInstance && this.state.mode === 'all') {
          this.fontPickerInstance.destroy();
          this.fontPickerInstance = null;
          // Reinitialize if we have an API key now
          if (this.googleApiKey) {
            this.initializeFontPicker();
          }
        }
        break;
    }
    
    this.render();
  }
  
  /**
   * Inject global styles for JSFontPicker dialog
   */
  private injectGlobalStyles() {
    let style = document.getElementById('stylizer-global-styles') as HTMLStyleElement;
    
    if (!style) {
      style = document.createElement('style');
      style.id = 'stylizer-global-styles';
      // Append at end of head for higher specificity
      document.head.appendChild(style);
    }
    
    // Always update the styles (in case JSFontPicker added new elements)
    style.textContent = globalStyles;
    
    // Move to end of head to ensure it's last (highest priority)
    if (style.parentNode) {
      style.remove();
      document.head.appendChild(style);
    }
  }
  
  /**
   * Render the component
   */
  private render() {
    // Apply shadow styles
    const styleEl = document.createElement('style');
    styleEl.textContent = shadowStyles;
    
    // Handle custom button element
    let customButtonElement: HTMLElement | null = null;
    let buttonConfigToUse = { ...this.buttonConfig };
    
    if (this.buttonConfig.customElement) {
      // Clone the custom element to avoid moving the original
      customButtonElement = this.buttonConfig.customElement.cloneNode(true) as HTMLElement;
      // Ensure it has the toggle-btn class for event listener attachment
      customButtonElement.classList.add('toggle-btn');
      // Preserve any aria-label or title
      if (this.buttonConfig.ariaLabel) {
        customButtonElement.setAttribute('aria-label', this.buttonConfig.ariaLabel);
        customButtonElement.setAttribute('title', this.buttonConfig.ariaLabel);
      }
    }
    
    // Generate template
    const template = createTemplate(this.state, buttonConfigToUse, !!this.googleApiKey);
    
    // Update shadow DOM
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(styleEl);
    
    const container = document.createElement('div');
    container.innerHTML = template;
    const rootElement = container.firstElementChild!;
    this.shadowRoot.appendChild(rootElement);
    
    // Replace button with custom element if provided
    if (customButtonElement) {
      const toggleBtn = this.shadowRoot.querySelector('.toggle-btn');
      if (toggleBtn && customButtonElement) {
        toggleBtn.replaceWith(customButtonElement);
      }
    }
    
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
    webComponentsLogger.debug('Toggle clicked', { isOpen: this.state.isOpen });
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
      webComponentsLogger.debug('Tab changed', { fontType: tab });
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
    
    // Skip if button is disabled
    if (target.hasAttribute('disabled')) {
      return;
    }
    
    webComponentsLogger.debug('Mode button clicked', { currentMode: this.state.mode, newMode });
    
    // Check if Browse All mode requires API key
    if (newMode === 'all' && !this.googleApiKey) {
      webComponentsLogger.warn('Browse All mode requires Google API key');
      alert('Browse All mode requires a Google Fonts API key. Please set the "google-api-key" attribute on the component.');
      return;
    }
    
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
    
    // Open the picker only if it was successfully initialized
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
    webComponentsLogger.debug('Reset clicked');
    this.reset();
  }
  
  /**
   * Initialize JSFontPicker
   */
  private async initializeFontPicker() {
    if (!this.buttonRef) return;
    
    try {
      // Ensure global styles are injected before loading picker
      this.injectGlobalStyles();
      
      // Dynamically import JSFontPicker
      const FontPickerModule = await import('fontpicker/dist/fontpicker.js');
      const FontPicker = FontPickerModule.default;
      
      // Wait a tick to ensure picker styles are loaded, then re-inject our overrides
      await new Promise(resolve => setTimeout(resolve, 0));
      
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
          webComponentsLogger.warn('Browse All mode requires API key');
          return;
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
      picker.on('pick', (font: any) => {
        if (font && font.family) {
          this.applyFont(font.family.name);
        }
      });
      
      // Re-inject styles after picker is created (FontPicker doesn't support 'open' event)
      setTimeout(() => {
        this.injectGlobalStyles();
      }, 200);
      
      this.fontPickerInstance = picker;
      
      webComponentsLogger.info('Picker initialized', {
        mode: this.state.mode,
        fontCount: this.state.mode === 'curated' ? this.curatedFonts.length : 'all'
      });
    } catch (error) {
      webComponentsLogger.error('Failed to initialize FontPicker', error);
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
    
    webComponentsLogger.info('Font applied', {
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
    
    webComponentsLogger.info('Fonts reset', {
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

