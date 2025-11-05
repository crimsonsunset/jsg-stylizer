/**
 * Styles for Stylizer Web Component
 */

/**
 * Shadow DOM styles (for component panel)
 */
export const shadowStyles = `
  :host {
    /* Inherit theme variables from outside (with fallbacks) */
    --background: var(--stylizer-background, var(--background, #ffffff));
    --text: var(--stylizer-text, var(--text, #000000));
    --accent: var(--stylizer-accent, var(--accent, #3b82f6));
    --border: var(--stylizer-border, var(--border, #e5e7eb));
    --surface: var(--stylizer-surface, var(--surface, #f9fafb));
    --text-secondary: var(--stylizer-text-secondary, var(--text-secondary, #6b7280));
    
    display: inline-block;
    position: relative;
  }
  
  * {
    box-sizing: border-box;
  }
  
  .stylizer-container {
    position: relative;
  }
  
  /* Toggle Button */
  .toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: 0.375rem;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--text);
    transition: all 0.2s;
  }
  
  .toggle-btn:hover {
    background-color: var(--surface);
  }
  
  .toggle-btn:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  
  /* Button Presets */
  .toggle-btn-preset-icon {
    /* Default icon button - no additional styles needed */
  }
  
  .toggle-btn-preset-text {
    padding: 0.5rem 1rem;
    background: transparent;
    border: none;
    font-weight: 500;
  }
  
  .toggle-btn-preset-text:hover {
    background-color: var(--surface);
  }
  
  .toggle-btn-preset-primary {
    padding: 0.75rem 1.5rem;
    background: var(--accent);
    color: white;
    border: 2px solid var(--accent);
    font-weight: 600;
    font-size: 1rem;
  }
  
  .toggle-btn-preset-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    background-color: var(--accent);
  }
  
  .toggle-btn-preset-secondary {
    padding: 0.75rem 1.5rem;
    background: transparent;
    color: var(--accent);
    border: 2px solid var(--accent);
    font-weight: 600;
    font-size: 1rem;
  }
  
  .toggle-btn-preset-secondary:hover {
    background: var(--accent);
    color: white;
  }
  
  /* Backdrop */
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 40;
  }
  
  /* Panel */
  .panel {
    position: absolute;
    right: 0;
    top: calc(100% + 0.5rem);
    width: 18rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    padding: 1rem;
    z-index: 50;
  }
  
  /* Header */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }
  
  .header h3 {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--text);
    margin: 0;
  }
  
  .reset-btn {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  
  .reset-btn:hover {
    opacity: 0.8;
  }
  
  /* Tabs */
  .tabs {
    display: flex;
    gap: 0.25rem;
    background: var(--background);
    border-radius: 0.375rem;
    padding: 0.25rem;
    margin-bottom: 0.75rem;
  }
  
  .tab {
    flex: 1;
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    border: none;
    border-radius: 0.25rem;
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .tab:hover {
    color: var(--text);
  }
  
  .tab.active {
    background: var(--surface);
    color: var(--text);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  
  /* Current Font Display */
  .current-font {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem;
    background: var(--background);
    border-radius: 0.375rem;
    margin-bottom: 0.75rem;
  }
  
  .current-font .label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 500;
  }
  
  .current-font .font-name {
    font-size: 0.875rem;
    color: var(--text);
    font-weight: 600;
  }
  
  /* Mode Buttons */
  .modes {
    display: flex;
    gap: 0.5rem;
  }
  
  .mode-btn {
    flex: 1;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.375rem;
    border: 1px solid var(--border);
    background: var(--background);
    color: var(--text);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .mode-btn:hover {
    background: var(--surface);
  }
  
  .mode-btn.active {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }
  
  .mode-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/**
 * Global styles (for JSFontPicker dialog)
 * Injected into document.head
 */
export const globalStyles = `
  /* JSFontPicker Dialog Theming - Comprehensive Overrides */
  
  /* Set JSFontPicker CSS variables first */
  .fpb__modal {
    --fp-primary: var(--stylizer-accent, var(--accent, #3b82f6));
    --fp-light: #ffffff;
    --fp-border-color: var(--stylizer-border, var(--border, #e5e7eb));
    --fp-body-bg: var(--stylizer-background, var(--background, #ffffff));
    --fp-body-color: var(--stylizer-text, var(--text, #000000));
    --fp-body-bg-rgb: 15, 23, 42;
    --fp-border-color-rgb: 51, 65, 85;
    
    background-color: var(--stylizer-surface, var(--surface, #ffffff)) !important;
    border-color: var(--stylizer-border, var(--border, #e5e7eb)) !important;
    color: var(--stylizer-text, var(--text, #000000)) !important;
  }
  
  /* Override #fp__fonts to use dark background */
  .fpb__modal #fp__fonts {
    background-color: var(--stylizer-background, var(--background, #ffffff)) !important;
    border-color: var(--stylizer-border, var(--border, #e5e7eb)) !important;
    color: var(--stylizer-text, var(--text, #000000)) !important;
  }
  
  /* Font Items */
  .fpb__modal .fp__font-item {
    color: var(--stylizer-text, var(--text, #000000)) !important;
    background-color: var(--stylizer-background, var(--background, #ffffff)) !important;
    border-color: var(--stylizer-border, var(--border, #e5e7eb)) !important;
  }
  
  .fpb__modal .fp__font-item:hover {
    background-color: var(--stylizer-surface, var(--surface, #f3f4f6)) !important;
  }
  
  .fpb__modal .fp__font-item.fp__selected {
    background-color: var(--stylizer-accent, var(--accent, #3b82f6)) !important;
    color: white !important;
  }
  
  /* Font item buttons inside */
  .fpb__modal .fp__font-item button {
    background-color: transparent !important;
    color: var(--stylizer-text, var(--text, #000000)) !important;
  }
  
  .fpb__modal .fp__font-item:hover button {
    color: var(--stylizer-text, var(--text, #000000)) !important;
  }
  
  .fpb__modal .fp__font-item.fp__selected button {
    color: white !important;
  }
  
  /* Preview Area */
  .fpb__modal #fp__preview {
    color: var(--stylizer-text, var(--text, #000000)) !important;
    background-color: transparent !important;
  }
  
  /* Accordion/Filter Controls */
  .fpb__modal .fpb__accordion-toggle,
  .fpb__modal .fpb__accordion {
    color: var(--stylizer-text, var(--text, #000000)) !important;
    border-color: var(--stylizer-border, var(--border, #e5e7eb)) !important;
    background-color: var(--stylizer-background, var(--background, #ffffff)) !important;
  }
  
  /* Dropdowns/Selects - scoped to modal */
  .fpb__modal select,
  .fpb__modal select.fpb__select,
  .fpb__modal select[id*="fp"] {
    background-color: var(--stylizer-background, var(--background, #ffffff)) !important;
    border-color: var(--stylizer-border, var(--border, #e5e7eb)) !important;
    color: var(--stylizer-text, var(--text, #000000)) !important;
  }
  
  /* Checkboxes - scoped to modal */
  .fpb__modal input[type="checkbox"],
  .fpb__modal input[type="checkbox"][id*="fp"] {
    accent-color: var(--stylizer-accent, var(--accent, #3b82f6)) !important;
  }
  
  /* Labels - scoped to modal */
  .fpb__modal label,
  .fpb__modal label[for*="fp"] {
    color: var(--stylizer-text, var(--text, #000000)) !important;
  }
  
  /* Buttons - scoped to modal */
  .fpb__modal button,
  .fpb__modal button.fpb__btn,
  .fpb__modal button[id*="fp"] {
    background-color: var(--stylizer-background, var(--background, #ffffff)) !important;
    border-color: var(--stylizer-border, var(--border, #e5e7eb)) !important;
    color: var(--stylizer-text, var(--text, #000000)) !important;
  }
  
  .fpb__modal button:hover,
  .fpb__modal button.fpb__btn:hover {
    background-color: var(--stylizer-surface, var(--surface, #f3f4f6)) !important;
  }
  
  /* Specific button variants */
  .fpb__modal .fpb__btn-close {
    color: var(--stylizer-text, var(--text, #000000)) !important;
  }
  
  .fpb__modal .fpb__btn-secondary {
    background-color: var(--stylizer-surface, var(--surface, #f3f4f6)) !important;
    color: var(--stylizer-text, var(--text, #000000)) !important;
  }
  
  /* Scrollbar styling */
  #fp__fonts::-webkit-scrollbar {
    width: 8px;
  }
  
  #fp__fonts::-webkit-scrollbar-track {
    background: var(--stylizer-background, var(--background, #ffffff));
    border-radius: 4px;
  }
  
  #fp__fonts::-webkit-scrollbar-thumb {
    background: var(--stylizer-border, var(--border, #e5e7eb));
    border-radius: 4px;
  }
  
  #fp__fonts::-webkit-scrollbar-thumb:hover {
    background: var(--stylizer-text-secondary, var(--text-secondary, #6b7280));
  }
  
  /* Any other FP elements scoped to modal */
  .fpb__modal [id*="fp"],
  .fpb__modal [class*="fp__"],
  .fpb__modal [class*="fpb__"] {
    color: var(--stylizer-text, var(--text, #000000));
  }
`;


