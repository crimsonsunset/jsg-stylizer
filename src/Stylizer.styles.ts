/**
 * Styles for Stylizer
 * Global styles for JSFontPicker dialog theming
 */

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
    
    /* Position modal on right side */
    position: fixed !important;
    top: 00px !important;
    right: 00px !important;
    left: auto !important;
    transform: none !important;
    margin: 0 !important;
    height: calc(100vh - 190px) !important;
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


