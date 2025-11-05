# FontPicker Web Component - Universal Style Customizer Roadmap

**Version**: 1.0 Draft  
**Date**: November 5, 2025  
**Status**: 📋 Planning Phase

---

## Overview

Transform the current React-based FontPicker component into a framework-agnostic Web Component that works in vanilla JS, React, Vue, Svelte, Angular, and any other framework (or no framework at all). This will create a truly portable, universal font customization tool.

### Why Web Components?

- **True Framework Agnostic**: Works everywhere without adapters
- **Standard Web Platform**: Built on web standards (Custom Elements, Shadow DOM)
- **Encapsulation**: Styles and logic isolated from page
- **Future-Proof**: Native browser support, no build step required
- **Single Source**: One component for all frameworks

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│              <font-picker> Custom Element                │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Shadow DOM                           │  │
│  │  ┌─────────────────────────────────────────────┐ │  │
│  │  │  Component Panel UI                         │ │  │
│  │  │  - Tabs (Primary/Secondary)                 │ │  │
│  │  │  - Mode Buttons (Curated/Browse All)        │ │  │
│  │  │  - Reset Button                             │ │  │
│  │  └─────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ├─► JSFontPicker (renders to body)
                          ├─► CSS Variables (document root)
                          ├─► JSG Logger
                          └─► Custom Events (font-changed, etc.)
```

---

## Package Structure

```
src/components/web-components/font-picker/
├── index.ts                    # Registers custom element, main export
├── FontPicker.ts              # Main Web Component class
├── FontPicker.styles.ts       # Shadow DOM + global styles
├── template.ts                # HTML template generation
├── types.ts                   # TypeScript definitions
├── logger-utils.ts            # JSG Logger integration
├── constants.ts               # Curated fonts, defaults, configs
├── package.json               # NPM package configuration
└── README.md                  # Multi-framework usage docs
```

---

## Implementation Phases

### Phase 1: Core Web Component Class

**File**: `FontPicker.ts`

#### A. Class Definition
```typescript
class FontPickerElement extends HTMLElement {
  // Shadow root
  private shadowRoot: ShadowRoot;
  
  // State management
  private isOpen: boolean = false;
  private mode: FontMode = 'curated';
  private fontType: FontType = 'primary';
  private primaryFont: string;
  private secondaryFont: string;
  
  // JSFontPicker instance
  private fontPickerInstance: any = null;
  
  // DOM refs
  private buttonRef: HTMLElement | null = null;
}
```

#### B. Observed Attributes (kebab-case)
```typescript
static observedAttributes = [
  'is-development',              // boolean - show/hide in dev
  'default-primary-font',        // string - primary font name
  'default-secondary-font',      // string - secondary font name
  'google-api-key',              // string - API key for Browse All
  'preview-text',                // string - sample text in picker
  'css-variable-primary',        // string - CSS var name (--font-primary)
  'css-variable-secondary',      // string - CSS var name (--font-secondary)
];
```

#### C. Complex Properties (set via JS)
```typescript
// Set via JavaScript, not HTML attributes
curatedFonts: string[] = CURATED_FONTS;
systemFonts: string[] = SYSTEM_FONTS;
themeCSSVariables: ThemeConfig = {
  background: '--background',
  text: '--text',
  accent: '--accent',
  border: '--border',
  surface: '--surface',
  textSecondary: '--text-secondary'
};
```

#### D. Lifecycle Methods

**constructor()**
- Call `super()`
- Attach Shadow DOM: `this.attachShadow({ mode: 'open' })`
- Initialize default state
- Bind methods

**connectedCallback()**
- Component added to DOM
- Render initial UI
- Attach event listeners
- Inject global styles for JSFontPicker dialog
- Initialize fonts from attributes

**disconnectedCallback()**
- Component removed from DOM
- Cleanup JSFontPicker instances
- Remove global styles
- Remove event listeners

**attributeChangedCallback(name, oldValue, newValue)**
- Called when observed attributes change
- Update internal state
- Re-render if needed
- Handle boolean string conversion ('true' → true)

#### E. Core Methods

**render()**
- Generate HTML template
- Inject into Shadow DOM
- Cache DOM references
- Called on mount and state changes

**attachEventListeners()**
- Toggle button click
- Tab clicks (Primary/Secondary)
- Mode button clicks (Curated/Browse All)
- Reset button click
- Outside click for panel close

**initializeFontPicker(mode)**
- Dynamically import JSFontPicker
- Configure based on current mode
- Create instance attached to hidden button
- Set up event listeners for font selection
- Log initialization via JSG Logger

**applyFont(fontFamily, fontType)**
- Get CSS variable name from attributes
- Update document root CSS variable
- Update internal state
- Log application
- Emit custom event

**handleModeChange(newMode)**
- Destroy existing picker if mode changed
- Update mode state
- Re-initialize picker
- Open picker dialog

**resetFont()**
- Reset both fonts to defaults
- Update CSS variables
- Update picker display
- Log action

**emitEvent(eventName, detail)**
- Dispatch custom event
- Set `bubbles: true` and `composed: true` for framework compatibility

---

### Phase 2: Shadow DOM Template & Styles

**File**: `template.ts`

#### HTML Template Structure
```typescript
export function createTemplate(state: ComponentState): string {
  return `
    <div class="font-picker-container">
      <!-- Toggle Button -->
      <button class="toggle-btn" aria-label="Font Picker">
        <svg><!-- IoText icon SVG --></svg>
      </button>
      
      <!-- Panel (conditionally shown) -->
      ${state.isOpen ? `
        <div class="backdrop"></div>
        <div class="panel">
          <!-- Header -->
          <div class="header">
            <h3>Font Experiments</h3>
            <button class="reset-btn">Reset</button>
          </div>
          
          <!-- Font Type Tabs -->
          <div class="tabs">
            <button class="tab ${state.fontType === 'primary' ? 'active' : ''}">
              Primary
            </button>
            <button class="tab ${state.fontType === 'secondary' ? 'active' : ''}">
              Secondary
            </button>
          </div>
          
          <!-- Mode Buttons -->
          <div class="modes">
            <button class="mode-btn ${state.mode === 'curated' ? 'active' : ''}">
              Curated
            </button>
            <button class="mode-btn ${state.mode === 'all' ? 'active' : ''}">
              Browse All
            </button>
          </div>
          
          <!-- Hidden button for JSFontPicker -->
          <button class="hidden-picker-btn" style="display: none;"></button>
        </div>
      ` : ''}
    </div>
  `;
}
```

**File**: `FontPicker.styles.ts`

#### Dual Style Strategy

**1. Internal Styles (Shadow DOM)**
```typescript
export const shadowStyles = `
  :host {
    /* Inherit theme variables from outside */
    --background: var(--fp-background, #ffffff);
    --text: var(--fp-text, #000000);
    --accent: var(--fp-accent, #3b82f6);
    --border: var(--fp-border, #e5e7eb);
    --surface: var(--fp-surface, #f9fafb);
    
    display: inline-block;
    position: relative;
  }
  
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
  }
  
  .toggle-btn:hover {
    background-color: var(--surface);
  }
  
  .panel {
    position: absolute;
    right: 0;
    top: calc(100% + 0.5rem);
    width: 18rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    z-index: 50;
  }
  
  /* ... more component panel styles */
`;
```

**2. Global Styles (Injected to document)**
```typescript
export const globalStyles = `
  /* JSFontPicker dialog theming */
  .fpb__modal {
    background-color: var(--fp-body-bg, #ffffff) !important;
    border-color: var(--fp-border-color, #e5e7eb) !important;
  }
  
  #fp__fonts {
    background-color: var(--fp-body-bg, #ffffff);
    border-color: var(--fp-border-color, #e5e7eb) !important;
  }
  
  .fp__font-item {
    color: var(--fp-body-color, #000000);
  }
  
  .fp__font-item:hover {
    background-color: var(--fp-hover-bg, #f3f4f6) !important;
  }
  
  .fp__font-item.fp__selected {
    background-color: var(--fp-primary, #3b82f6) !important;
    color: white !important;
  }
  
  /* ... more JSFontPicker overrides */
`;
```

#### Style Injection
```typescript
// In constructor or connectedCallback
injectGlobalStyles() {
  if (document.getElementById('font-picker-global-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'font-picker-global-styles';
  style.textContent = globalStyles;
  document.head.appendChild(style);
}
```

---

### Phase 3: JSG Logger Integration

**File**: `logger-utils.ts`

```typescript
import JSGLogger from '@crimsonsunset/jsg-logger';

// Initialize once
const logger = JSGLogger.getInstance();

// Export namespace for web components
export const fontPickerLogger = logger.components.webComponents();

// Convenience exports
export const logFontChange = (fontType: string, fontFamily: string) => {
  fontPickerLogger.info('Font applied', { fontType, fontFamily });
};

export const logPickerInit = (mode: string, fontCount: number) => {
  fontPickerLogger.info('Picker initialized', { mode, fontCount });
};

export const logError = (message: string, error: any) => {
  fontPickerLogger.error(message, { error: error.message, stack: error.stack });
};
```

**Usage in Component** (no try-catch needed):
```typescript
import { fontPickerLogger, logFontChange } from './logger-utils';

// Direct usage
fontPickerLogger.debug('Panel opened', { mode: this.mode });

// Or helper
logFontChange(this.fontType, fontFamily);
```

---

### Phase 4: Constants & Configuration

**File**: `constants.ts`

```typescript
// Curated Google Fonts (alphabetically sorted)
export const CURATED_FONTS = [
  "Aldrich", "Anta", "Audiowide", "Bungee Inline",
  "Cabin", "Changa One", "Geostar", "Goldman",
  "Inter", "Jersey 10", "Kumar One Outline", "Michroma",
  "Nabla", "Nova Square", "Orbitron", "Oxanium",
  "Passero One", "Prosto One", "Quantico", "Revalia",
  "Righteous", "Roboto", "Rubik Doodle Triangles", "Rubik Glitch",
  "Russo One", "Sansation", "Share Tech Mono", "Silkscreen",
  "Sixtyfour", "Space Mono", "Stalinist One", "Syncopate",
  "Tilt Neon", "Tilt Prism", "Tomorrow", "VT323",
  "Zen Dots", "Zen Tokyo Zoo"
];

// System fonts for quick testing
export const SYSTEM_FONTS = [
  "Arial", "Helvetica", "Times New Roman", "Georgia",
  "Courier New", "Verdana", "Trebuchet MS", "Comic Sans MS",
  "Impact", "Lucida Console", "Tahoma", "Palatino"
];

// Default configuration
export const DEFAULT_CONFIG = {
  primaryFont: "Roboto",
  secondaryFont: "Open Sans",
  previewText: "Build. Lead. Learn. JSG Tech Check.",
  cssVariablePrimary: "--font-primary",
  cssVariableSecondary: "--font-secondary",
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
```

---

### Phase 5: TypeScript Declarations

**File**: `types.ts`

```typescript
// Component state
export type FontMode = 'curated' | 'all';
export type FontType = 'primary' | 'secondary';

export interface ComponentState {
  isOpen: boolean;
  mode: FontMode;
  fontType: FontType;
  primaryFont: string;
  secondaryFont: string;
}

// Theme configuration
export interface ThemeConfig {
  background: string;
  text: string;
  accent: string;
  border: string;
  surface: string;
  textSecondary: string;
}

// Custom event details
export interface FontChangedEventDetail {
  fontType: FontType;
  fontFamily: string;
  cssVariable: string;
}

export interface FontResetEventDetail {
  primaryFont: string;
  secondaryFont: string;
}

// HTML attributes interface
export interface FontPickerAttributes {
  'is-development'?: string | boolean;
  'default-primary-font'?: string;
  'default-secondary-font'?: string;
  'google-api-key'?: string;
  'preview-text'?: string;
  'css-variable-primary'?: string;
  'css-variable-secondary'?: string;
}

// Global type augmentation for TypeScript
declare global {
  // For React/TSX
  namespace JSX {
    interface IntrinsicElements {
      'font-picker': FontPickerAttributes & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
  
  // For vanilla TypeScript
  interface HTMLElementTagNameMap {
    'font-picker': FontPickerElement;
  }
}

// Main element interface
export interface FontPickerElement extends HTMLElement {
  // Attributes (can be set via HTML or JS)
  isDevelopment: boolean;
  defaultPrimaryFont: string;
  defaultSecondaryFont: string;
  googleApiKey: string;
  previewText: string;
  cssVariablePrimary: string;
  cssVariableSecondary: string;
  
  // Complex properties (JS only)
  curatedFonts: string[];
  systemFonts: string[];
  themeCSSVariables: ThemeConfig;
  
  // Methods
  open(): void;
  close(): void;
  reset(): void;
}
```

---

### Phase 6: Custom Events

Emit events for framework reactivity:

```typescript
// Font changed event
this.dispatchEvent(new CustomEvent<FontChangedEventDetail>('font-changed', {
  detail: {
    fontType: this.fontType,
    fontFamily: fontFamily,
    cssVariable: this.fontType === 'primary' 
      ? this.cssVariablePrimary 
      : this.cssVariableSecondary
  },
  bubbles: true,
  composed: true // Crosses shadow DOM boundary
}));

// Font reset event
this.dispatchEvent(new CustomEvent<FontResetEventDetail>('font-reset', {
  detail: {
    primaryFont: this.defaultPrimaryFont,
    secondaryFont: this.defaultSecondaryFont
  },
  bubbles: true,
  composed: true
}));
```

---

### Phase 7: Registration & Export

**File**: `index.ts`

```typescript
import { FontPickerElement } from './FontPicker';

// Register custom element
if (!customElements.get('font-picker')) {
  customElements.define('font-picker', FontPickerElement);
}

// Export for type safety
export { FontPickerElement };
export * from './types';
```

---

### Phase 8: Package Configuration

**File**: `package.json`

```json
{
  "name": "@jsg/font-picker",
  "version": "1.0.0",
  "description": "Universal font picker Web Component for experimenting with Google Fonts",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.esm.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./style.css": "./dist/style.css"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "fontpicker": "github:wipeautcrafter/jsfontpicker",
    "@crimsonsunset/jsg-logger": "^1.1.0"
  },
  "devDependencies": {
    "@rollup/plugin-typescript": "^11.1.5",
    "rollup": "^4.0.0",
    "typescript": "^5.2.2"
  },
  "keywords": [
    "web-component",
    "custom-element",
    "font-picker",
    "google-fonts",
    "typography",
    "framework-agnostic"
  ],
  "author": "JSG Tech Check",
  "license": "MIT"
}
```

---

## Framework Integration Examples

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/@jsg/font-picker/dist/style.css">
</head>
<body>
  <font-picker 
    is-development="true"
    default-primary-font="Roboto"
    google-api-key="YOUR_API_KEY">
  </font-picker>
  
  <script type="module">
    import '@jsg/font-picker';
    
    const picker = document.querySelector('font-picker');
    
    // Set complex properties
    picker.curatedFonts = ['Roboto', 'Open Sans', 'Lato'];
    picker.themeCSSVariables = {
      background: '--my-bg',
      text: '--my-text',
      accent: '--my-accent',
      // ...
    };
    
    // Listen to events
    picker.addEventListener('font-changed', (e) => {
      console.log('Font changed:', e.detail);
    });
  </script>
</body>
</html>
```

---

### React

```tsx
import '@jsg/font-picker';
import { useEffect, useRef } from 'react';

// Type augmentation (in types file)
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'font-picker': any;
    }
  }
}

function App() {
  const pickerRef = useRef<any>(null);
  
  useEffect(() => {
    if (pickerRef.current) {
      // Set complex properties
      pickerRef.current.curatedFonts = ['Roboto', 'Open Sans'];
      pickerRef.current.themeCSSVariables = {
        background: '--background',
        text: '--text',
        accent: '--accent',
        border: '--border',
        surface: '--surface',
        textSecondary: '--text-secondary'
      };
    }
  }, []);
  
  const handleFontChange = (e: CustomEvent) => {
    console.log('Font changed:', e.detail);
  };
  
  return (
    <font-picker
      ref={pickerRef}
      is-development={import.meta.env.DEV}
      default-primary-font="Roboto"
      default-secondary-font="Open Sans"
      google-api-key={import.meta.env.VITE_GOOGLE_FONTS_API_KEY}
      onFont-changed={handleFontChange}
    />
  );
}

export default App;
```

---

### Svelte

```svelte
<script lang="ts">
  import '@jsg/font-picker';
  import { onMount } from 'svelte';
  
  let pickerElement: any;
  
  onMount(() => {
    if (pickerElement) {
      // Set complex properties
      pickerElement.curatedFonts = ['Roboto', 'Open Sans', 'Lato'];
      pickerElement.themeCSSVariables = {
        background: '--background',
        text: '--text',
        accent: '--accent',
        border: '--border',
        surface: '--surface',
        textSecondary: '--text-secondary'
      };
    }
  });
  
  function handleFontChange(e: CustomEvent) {
    console.log('Font changed:', e.detail);
  }
</script>

<font-picker
  bind:this={pickerElement}
  is-development="true"
  default-primary-font="Roboto"
  default-secondary-font="Open Sans"
  google-api-key={import.meta.env.VITE_GOOGLE_FONTS_API_KEY}
  on:font-changed={handleFontChange}
/>
```

---

### Vue 3

```vue
<script setup lang="ts">
import '@jsg/font-picker';
import { ref, onMounted } from 'vue';

const pickerRef = ref<any>(null);

onMounted(() => {
  if (pickerRef.value) {
    // Set complex properties
    pickerRef.value.curatedFonts = ['Roboto', 'Open Sans', 'Lato'];
    pickerRef.value.themeCSSVariables = {
      background: '--background',
      text: '--text',
      accent: '--accent',
      border: '--border',
      surface: '--surface',
      textSecondary: '--text-secondary'
    };
  }
});

const handleFontChange = (e: CustomEvent) => {
  console.log('Font changed:', e.detail);
};
</script>

<template>
  <font-picker
    ref="pickerRef"
    is-development="true"
    default-primary-font="Roboto"
    default-secondary-font="Open Sans"
    :google-api-key="import.meta.env.VITE_GOOGLE_FONTS_API_KEY"
    @font-changed="handleFontChange"
  />
</template>
```

---

### Astro

```astro
---
// Current JSG Tech Check site integration
import '@jsg/font-picker';

const isDev = import.meta.env.DEV;
const apiKey = import.meta.env.PUBLIC_GOOGLE_FONTS_API_KEY;
---

<font-picker
  is-development={isDev}
  default-primary-font="Sansation"
  default-secondary-font="Michroma"
  google-api-key={apiKey}>
</font-picker>

<script>
  // Set complex properties client-side
  const picker = document.querySelector('font-picker');
  if (picker) {
    picker.curatedFonts = [
      'Aldrich', 'Anta', 'Audiowide', /* ... */
    ];
    
    picker.themeCSSVariables = {
      background: '--background',
      text: '--text',
      accent: '--accent',
      border: '--border',
      surface: '--surface',
      textSecondary: '--text-secondary'
    };
  }
</script>
```

---

## Migration from Current React Component

### Current Astro Integration
```astro
---
import FontPicker from "@/components/react/FontPicker";
---
<FontPicker client:only="react" />
```

### New Web Component Integration
```astro
---
import '@jsg/font-picker';
---
<font-picker is-development={import.meta.env.DEV} />
```

### Benefits
- No `client:only="react"` directive needed
- Smaller bundle (no React runtime for this component)
- Works in any Astro page regardless of framework
- Can use in Astro, React, Vue, Svelte components interchangeably

---

## Technical Challenges & Solutions

### 1. Shadow DOM vs JSFontPicker Dialog

**Challenge**: JSFontPicker creates a modal dialog that renders to `document.body`, outside the Shadow DOM.

**Solution**:
- Component panel UI lives in Shadow DOM (isolated styles)
- JSFontPicker dialog renders to body (expected behavior)
- Inject global styles to `document.head` for dialog theming
- Use CSS custom properties to bridge theme variables

### 2. Attribute vs Property Distinction

**Challenge**: HTML attributes are strings, but we need complex objects (arrays, configs).

**Solution**:
- Simple values → Attributes (strings, booleans, numbers)
- Complex values → Properties (set via JavaScript)
- Document this clearly in README
- Provide helper functions for common configs

### 3. Framework Reactivity

**Challenge**: Different frameworks have different reactivity models.

**Solution**:
- Emit custom events for all state changes
- Use `bubbles: true` and `composed: true`
- Provide clear event documentation
- Framework wrappers can listen to events and update state

### 4. TypeScript Support

**Challenge**: Custom elements need TypeScript declarations for all frameworks.

**Solution**:
- Extend `HTMLElementTagNameMap` for vanilla TS
- Extend `JSX.IntrinsicElements` for React/TSX
- Provide `.d.ts` files in package
- Document type imports for each framework

### 5. CSS Theming Across Shadow Boundary

**Challenge**: Shadow DOM isolates styles, but we need theme integration.

**Solution**:
- Use CSS custom properties (they penetrate Shadow DOM)
- Consumer defines theme vars on `:root` or `<html>`
- Component reads vars via `var(--consumer-var, fallback)`
- Document required CSS variables

---

## Testing Strategy

### Unit Testing
- Test component lifecycle (connect, disconnect, attribute changes)
- Test state management (mode switching, font selection)
- Test event emission
- Test attribute/property handling

### Integration Testing
- Test in vanilla HTML page
- Test in React app
- Test in Svelte app
- Test in current Astro project

### Visual Testing
- Test Shadow DOM styles render correctly
- Test JSFontPicker dialog theming
- Test light/dark mode switching
- Test responsive behavior

### Browser Testing
- Chrome/Edge (Chromium)
- Firefox
- Safari (WebKit)
- Mobile browsers (iOS Safari, Chrome Android)

---

## Implementation Timeline

### Phase 1: Foundation (Week 1)
- Set up package structure
- Create TypeScript types
- Extract constants
- Set up JSG Logger integration

### Phase 2: Core Component (Week 2)
- Build FontPickerElement class
- Implement lifecycle methods
- Create template generation
- Handle attribute/property logic

### Phase 3: Styling & JSFontPicker (Week 3)
- Implement Shadow DOM styles
- Inject global styles for dialog
- Integrate JSFontPicker
- Handle theme CSS variables

### Phase 4: Events & Polish (Week 4)
- Implement custom events
- Add public methods (open, close, reset)
- Create comprehensive README
- Document all framework integrations

### Phase 5: Testing & Release (Week 5)
- Test in vanilla JS
- Test in React
- Test in Svelte
- Test in Astro project
- Fix bugs, polish UX
- Publish to npm

---

## Future Enhancements

### v1.1 - Enhanced Features
- Color picker integration (for accent colors)
- Font pairing suggestions
- Export/import configurations
- Preset themes

### v1.2 - Advanced Customization
- Custom font sources (not just Google Fonts)
- Font loading strategies (preload, async, etc.)
- Performance metrics
- A11y improvements

### v1.3 - Visual Editor
- Live preview area within component
- Font comparison view
- Typography scale generator
- CSS export functionality

---

## Success Metrics

- ✅ Works in 5+ frameworks (Vanilla, React, Vue, Svelte, Astro)
- ✅ < 50KB gzipped bundle size
- ✅ TypeScript support with full type safety
- ✅ Comprehensive documentation with examples
- ✅ Zero framework dependencies (except JSG Logger)
- ✅ Published to npm as `@jsg/font-picker`
- ✅ Maintains feature parity with React version

---

## Resources

- [Web Components MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Custom Elements v1](https://html.spec.whatwg.org/multipage/custom-elements.html)
- [Shadow DOM v1](https://dom.spec.whatwg.org/#shadow-trees)
- [JSFontPicker Docs](https://www.jsfontpicker.com/)
- [Google Fonts API](https://developers.google.com/fonts/docs/getting_started)
- [JSG Logger](https://www.npmjs.com/package/@crimsonsunset/jsg-logger)

---

## Questions & Decisions Log

### Q1: Should we support IE11?
**Decision**: No. Web Components require modern browsers. Use polyfills if IE11 support is critical.

### Q2: Should we bundle React wrapper for convenience?
**Decision**: Optional. Provide example but let users use raw Web Component for maximum flexibility.

### Q3: How to handle Google Fonts API key?
**Decision**: Attribute for simple use, but also support passing via property for security.

### Q4: Should we version the Web Component tag name?
**Decision**: No. Use `<font-picker>` not `<font-picker-v1>`. Breaking changes = major version bump.

### Q5: How to handle SSR/SSG frameworks?
**Decision**: Component is client-only by nature. Works fine with Astro, Next.js, etc. as long as rendered client-side.

---

## Conclusion

This roadmap provides a comprehensive plan for transforming the FontPicker from a React component into a universal Web Component that works everywhere. The architecture leverages web standards while maintaining all features and adding framework flexibility.

**Next Steps:**
1. Review and approve this roadmap
2. Create package scaffolding
3. Begin Phase 1 implementation
4. Set up testing infrastructure
5. Iterate based on testing feedback

---

**Status**: 📋 Awaiting Approval  
**Last Updated**: November 5, 2025


