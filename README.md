# 🎨 Stylizer

> Universal Font Picker Web Component for experimenting with Google Fonts

A framework-agnostic Web Component that lets you quickly experiment with different Google Fonts on your site. Works in vanilla JavaScript, React, Vue, Svelte, Astro, and any other framework (or no framework at all).

[![npm version](https://img.shields.io/npm/v/@jsg/stylizer.svg)](https://www.npmjs.com/package/@jsg/stylizer)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🌐 **Framework Agnostic** - Works everywhere (React, Vue, Svelte, Astro, vanilla JS)
- 🎯 **Dual Font Support** - Separate Primary & Secondary font selection
- 🎨 **Curated Mode** - 38 handpicked fonts, zero API key needed
- 🔍 **Browse All Mode** - Access 1500+ Google Fonts with API key
- ⭐ **Favorites System** - Save your favorite fonts to localStorage
- 🎭 **Font Variants** - Select font weights (100-900) and italic styles
- 🌓 **Theme Integration** - Automatic light/dark mode support via CSS variables
- 🔧 **Dev-Only Display** - Hide in production, show during development
- 📦 **Tiny Bundle** - Lightweight with minimal dependencies
- 🚀 **Zero Config** - Works out of the box with sensible defaults

## 📦 Installation

```bash
npm install @jsg/stylizer
```

Or use a CDN:

```html
<script type="module" src="https://unpkg.com/@jsg/stylizer"></script>
```

## 🚀 Quick Start

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    :root {
      --font-primary: "Roboto", sans-serif;
      --font-secondary: "Open Sans", sans-serif;
    }
    
    body {
      font-family: var(--font-primary);
    }
    
    h1, h2, h3 {
      font-family: var(--font-secondary);
    }
  </style>
</head>
<body>
  <h1>Hello Stylizer!</h1>
  
  <!-- Add the component -->
  <jsg-stylizer 
    is-development="true"
    default-primary-font="Roboto"
    default-secondary-font="Open Sans">
  </jsg-stylizer>
  
  <script type="module">
    import '@jsg/stylizer';
    
    // Listen to font changes
    document.querySelector('jsg-stylizer').addEventListener('font-changed', (e) => {
      console.log('Font changed:', e.detail);
    });
  </script>
</body>
</html>
```

### React

```tsx
import '@jsg/stylizer';

// Type support
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'jsg-stylizer': any;
    }
  }
}

function App() {
  const handleFontChange = (e: CustomEvent) => {
    console.log('Font changed:', e.detail);
  };
  
  return (
    <div>
      <h1>My React App</h1>
      <jsg-stylizer
        is-development={import.meta.env.DEV}
        default-primary-font="Roboto"
        default-secondary-font="Open Sans"
        onFont-changed={handleFontChange}
      />
    </div>
  );
}
```

### Svelte

```svelte
<script lang="ts">
  import '@jsg/stylizer';
  
  function handleFontChange(e: CustomEvent) {
    console.log('Font changed:', e.detail);
  }
</script>

<h1>My Svelte App</h1>

<jsg-stylizer
  is-development="true"
  default-primary-font="Roboto"
  default-secondary-font="Open Sans"
  on:font-changed={handleFontChange}
/>
```

### Vue 3

```vue
<script setup lang="ts">
import '@jsg/stylizer';

const handleFontChange = (e: CustomEvent) => {
  console.log('Font changed:', e.detail);
};
</script>

<template>
  <div>
    <h1>My Vue App</h1>
    <jsg-stylizer
      is-development="true"
      default-primary-font="Roboto"
      default-secondary-font="Open Sans"
      @font-changed="handleFontChange"
    />
  </div>
</template>
```

### Astro

```astro
---
import '@jsg/stylizer';
---

<h1>My Astro Site</h1>

<jsg-stylizer
  is-development={import.meta.env.DEV}
  default-primary-font="Roboto"
  default-secondary-font="Open Sans"
/>
```

## 📚 API Documentation

### Attributes

Set these via HTML attributes:

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `is-development` | boolean | `false` | Show component only in development |
| `default-primary-font` | string | `"Roboto"` | Default primary font |
| `default-secondary-font` | string | `"Open Sans"` | Default secondary font |
| `google-api-key` | string | `""` | Google Fonts API key (for Browse All mode) |
| `preview-text` | string | `"The quick..."` | Sample text in font picker |
| `css-variable-primary` | string | `"--font-primary"` | CSS variable name for primary font |
| `css-variable-secondary` | string | `"--font-secondary"` | CSS variable name for secondary font |

### Properties

Set these via JavaScript:

```javascript
const stylizer = document.querySelector('jsg-stylizer');

// Customize curated fonts list
stylizer.curatedFonts = ['Roboto', 'Open Sans', 'Lato', 'Montserrat'];

// Customize system fonts
stylizer.systemFonts = ['Arial', 'Helvetica', 'Georgia'];

// Map theme CSS variables
stylizer.themeCSSVariables = {
  background: '--my-bg-color',
  text: '--my-text-color',
  accent: '--my-accent-color',
  border: '--my-border-color',
  surface: '--my-surface-color',
  textSecondary: '--my-secondary-text'
};
```

### Methods

```javascript
const stylizer = document.querySelector('jsg-stylizer');

// Open the font picker panel
stylizer.open();

// Close the font picker panel
stylizer.close();

// Reset both fonts to defaults
stylizer.reset();
```

### Events

Listen to custom events:

```javascript
// Font changed event
stylizer.addEventListener('font-changed', (e) => {
  console.log('Font type:', e.detail.fontType);        // 'primary' | 'secondary'
  console.log('Font family:', e.detail.fontFamily);   // 'Roboto'
  console.log('CSS variable:', e.detail.cssVariable); // '--font-primary'
});

// Font reset event
stylizer.addEventListener('font-reset', (e) => {
  console.log('Primary:', e.detail.primaryFont);
  console.log('Secondary:', e.detail.secondaryFont);
});
```

## 🎨 Theme Integration

Stylizer uses CSS variables for theme integration. Define these in your theme:

```css
:root {
  /* Required for fonts */
  --font-primary: "Roboto", sans-serif;
  --font-secondary: "Open Sans", sans-serif;
  
  /* Optional: Customize Stylizer appearance */
  --stylizer-background: #ffffff;
  --stylizer-text: #000000;
  --stylizer-accent: #3b82f6;
  --stylizer-border: #e5e7eb;
  --stylizer-surface: #f9fafb;
  --stylizer-text-secondary: #6b7280;
}

/* Dark mode */
[data-theme="dark"] {
  --stylizer-background: #1a1a1a;
  --stylizer-text: #ffffff;
  --stylizer-accent: #60a5fa;
  --stylizer-border: #374151;
  --stylizer-surface: #262626;
  --stylizer-text-secondary: #9ca3af;
}
```

## 🔑 Google Fonts API Key

**Curated Mode** (default) works without an API key - it uses 38 pre-selected fonts.

**Browse All Mode** requires a free Google Fonts API key to access all 1500+ fonts:

1. Visit [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project
3. Enable "Google Fonts Developer API"
4. Create an API key
5. Pass it to the component:

```html
<jsg-stylizer google-api-key="YOUR_API_KEY_HERE"></jsg-stylizer>
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Watch mode
npm run dev

# Type check
npm run type-check

# Run demo site
npm run demo
```

## 📄 License

MIT © JSG Tech Check

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 🔗 Links

- [Demo Site](https://stylizer-demo.netlify.app)
- [GitHub Repository](https://github.com/yourusername/jsg-stylizer)
- [JSFontPicker](https://www.jsfontpicker.com/) (underlying font picker library)
- [JSG Logger](https://www.npmjs.com/package/@crimsonsunset/jsg-logger)

---

Made with ❤️ by [JSG Tech Check](https://jsg-tech-check.com)


