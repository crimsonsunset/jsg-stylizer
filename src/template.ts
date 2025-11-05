/**
 * HTML template generation for Stylizer Web Component
 */

import type { ComponentState } from './types';

/**
 * Generate the component's HTML template
 */
export function createTemplate(state: ComponentState): string {
  return `
    <div class="stylizer-container">
      <!-- Toggle Button -->
      <button class="toggle-btn" aria-label="Font Picker" title="Font Picker">
        <svg width="20" height="20" viewBox="0 0 512 512" fill="currentColor">
          <path d="M208 48a16 16 0 00-16 16v64H80a16 16 0 00-16 16v32a16 16 0 0016 16h112v304a16 16 0 0016 16h32a16 16 0 0016-16V192h112a16 16 0 0016-16v-32a16 16 0 00-16-16H256V64a16 16 0 00-16-16z"/>
        </svg>
      </button>
      
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


