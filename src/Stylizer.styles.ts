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
    transition: background-color 0.2s;
  }
  
  .toggle-btn:hover {
    background-color: var(--surface);
  }
  
  .toggle-btn:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
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
  /* JSFontPicker Dialog Theming */
  .fpb__modal {
    background-color: var(--stylizer-surface, var(--surface, #ffffff)) !important;
    border-color: var(--stylizer-border, var(--border, #e5e7eb)) !important;
  }
  
  #fp__fonts {
    background-color: var(--stylizer-background, var(--background, #ffffff));
    border-color: var(--stylizer-border, var(--border, #e5e7eb)) !important;
  }
  
  .fp__font-item {
    color: var(--stylizer-text, var(--text, #000000));
  }
  
  .fp__font-item:hover {
    background-color: var(--stylizer-surface, var(--surface, #f3f4f6)) !important;
  }
  
  .fp__font-item.fp__selected {
    background-color: var(--stylizer-accent, var(--accent, #3b82f6)) !important;
    color: white !important;
  }
  
  .fpb__modal-header,
  .fpb__modal-footer {
    background-color: var(--stylizer-surface, var(--surface, #ffffff));
    border-color: var(--stylizer-border, var(--border, #e5e7eb)) !important;
  }
  
  .fpb__input {
    background-color: var(--stylizer-background, var(--background, #ffffff)) !important;
    border-color: var(--stylizer-border, var(--border, #e5e7eb)) !important;
    color: var(--stylizer-text, var(--text, #000000)) !important;
  }
  
  .fpb__input:focus {
    border-color: var(--stylizer-accent, var(--accent, #3b82f6)) !important;
    box-shadow: 0 0 0 0.25rem rgba(var(--stylizer-accent, 59, 130, 246), 0.25) !important;
  }
  
  #fp__preview {
    color: var(--stylizer-text, var(--text, #000000));
    background-color: transparent;
  }
  
  .fpb__accordion-toggle {
    color: var(--stylizer-text, var(--text, #000000)) !important;
    border-color: var(--stylizer-border, var(--border, #e5e7eb)) !important;
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
`;


