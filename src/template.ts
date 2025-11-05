/**
 * HTML template generation for Stylizer Web Component
 */

import type { ComponentState, ButtonConfig } from './types';

/**
 * Generate button HTML based on button configuration
 */
function generateButtonHTML(config: ButtonConfig): string {
  const preset = config.preset || 'icon';
  const ariaLabel = config.ariaLabel || 'Font Picker';
  const title = config.ariaLabel || 'Font Picker';
  
  let buttonClasses = 'toggle-btn';
  let buttonContent = '';
  
  if (preset === 'icon') {
    buttonClasses += ' toggle-btn-preset-icon';
    buttonContent = `
      <svg width="20" height="20" viewBox="0 0 512 512" fill="currentColor">
        <path d="M208 48a16 16 0 00-16 16v64H80a16 16 0 00-16 16v32a16 16 0 0016 16h112v304a16 16 0 0016 16h32a16 16 0 0016-16V192h112a16 16 0 0016-16v-32a16 16 0 00-16-16H256V64a16 16 0 00-16-16z"/>
      </svg>
    `;
  } else if (preset === 'text') {
    buttonClasses += ' toggle-btn-preset-text';
    buttonContent = config.text || 'Font Picker';
  } else if (preset === 'primary') {
    buttonClasses += ' toggle-btn-preset-primary';
    buttonContent = config.text || 'Font Picker';
  } else if (preset === 'secondary') {
    buttonClasses += ' toggle-btn-preset-secondary';
    buttonContent = config.text || 'Font Picker';
  }
  
  return `
    <button class="${buttonClasses}" aria-label="${ariaLabel}" title="${title}">
      ${buttonContent}
    </button>
  `;
}

/**
 * Generate the component's HTML template
 */
export function createTemplate(state: ComponentState, buttonConfig: ButtonConfig): string {
  return `
    <div class="stylizer-container">
      <!-- Toggle Button -->
      ${generateButtonHTML(buttonConfig)}
      
      ${state.isOpen ? `
        <!-- Backdrop -->
        <div class="backdrop"></div>
        
        <!-- Panel -->
        <div class="panel">
          <!-- Header -->
          <div class="header">
            <h3>Font Experiments</h3>
            <button class="reset-btn">Reset</button>
          </div>
          
          <!-- Font Type Tabs -->
          <div class="tabs">
            <button class="tab ${state.fontType === 'primary' ? 'active' : ''}" data-tab="primary">
              Primary
            </button>
            <button class="tab ${state.fontType === 'secondary' ? 'active' : ''}" data-tab="secondary">
              Secondary
            </button>
          </div>
          
          <!-- Current Font Display -->
          <div class="current-font">
            <span class="label">${state.fontType === 'primary' ? 'Primary' : 'Secondary'} Font:</span>
            <span class="font-name">${state.fontType === 'primary' ? state.primaryFont : state.secondaryFont}</span>
          </div>
          
          <!-- Mode Buttons -->
          <div class="modes">
            <button class="mode-btn ${state.mode === 'curated' ? 'active' : ''}" data-mode="curated">
              Curated
            </button>
            <button class="mode-btn ${state.mode === 'all' ? 'active' : ''}" data-mode="all">
              Browse All
            </button>
          </div>
          
          <!-- Hidden button for JSFontPicker -->
          <button class="hidden-picker-btn" style="display: none;" aria-hidden="true"></button>
        </div>
      ` : ''}
    </div>
  `;
}


