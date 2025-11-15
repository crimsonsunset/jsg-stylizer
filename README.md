# 🎨 Stylizer

> Config-driven font picker with DevTools sidebar for experimenting with Google Fonts

A framework-agnostic font picker that lets you quickly experiment with different Google Fonts on your site. Works in vanilla JavaScript, React, Vue, Svelte, Astro, and any other framework (or no framework at all).

[![npm version](https://img.shields.io/npm/v/jsg-stylizer.svg)](https://www.npmjs.com/package/jsg-stylizer)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🌐 **Framework Agnostic** - Works everywhere (React, Vue, Svelte, Astro, vanilla JS)
- 🎯 **Dual Font Support** - Separate Primary & Secondary font selection
- 🎨 **Curated Mode** - 38 handpicked fonts, zero API key needed
- 🔍 **Browse All Mode** - Access 1500+ Google Fonts with API key
- ⭐ **Favorites System** - Save your favorite fonts to localStorage
- 🎭 **Font Variants** - Select font weights (100-900) and italic styles
- 🌓 **Theme Integration** - Automatic light/dark mode support via CSS variables
- 🛠️ **DevTools Sidebar** - Slide-in panel for easy font selection
- 📦 **Tiny Bundle** - Lightweight with minimal dependencies
- 🚀 **Zero Config** - Works out of the box with sensible defaults

## 📦 Installation

```bash
npm install jsg-stylizer
```

### CSS Import (Optional)

Stylizer includes CSS that is automatically injected when you import the JavaScript module. If you prefer to import CSS manually (e.g., for better control over loading order), you can import it separately:

```javascript
import 'jsg-stylizer/style.css';
```

**Note**: All dependencies (Preact, Evergreen UI, fontpicker) are bundled with the package, so no additional peer dependencies are required.

## 🚀 Quick Start

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    :root {
      --font-primary-family: "Changa One", sans-serif;
      --font-primary-weight: 400;
      --font-primary-style: normal;
      --font-secondary-family: "Nova Square", sans-serif;
      --font-secondary-weight: 400;
      --font-secondary-style: normal;
    }
    
    body {
      font-family: var(--font-primary-family);
      font-weight: var(--font-primary-weight);
      font-style: var(--font-primary-style);
    }
    
    h1, h2, h3 {
      font-family: var(--font-secondary-family);
      font-weight: var(--font-secondary-weight);
      font-style: var(--font-secondary-style);
    }
  </style>
</head>
<body>
  <h1>Hello Stylizer!</h1>
  
  <script type="module">
    import { Stylizer } from 'jsg-stylizer';
    
    // Configure Stylizer
    Stylizer.configure({
      fonts: {
        primary: 'Changa One',
        secondary: 'Nova Square'
      },
      cssVariables: {
        primary: {
          family: '--font-primary-family',
          weight: '--font-primary-weight',
          style: '--font-primary-style'
        },
        secondary: {
          family: '--font-secondary-family',
          weight: '--font-secondary-weight',
          style: '--font-secondary-style'
        }
      }
    });
    
    // Listen to font changes
    window.addEventListener('stylizer-font-changed', (e) => {
      console.log('Font changed:', e.detail);
    });
  </script>
</body>
</html>
```

### React

```tsx
import { Stylizer } from 'jsg-stylizer';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    Stylizer.configure({
      fonts: {
        primary: 'Roboto',
        secondary: 'Open Sans'
      },
      cssVariables: {
        primary: {
          family: '--font-primary-family',
          weight: '--font-primary-weight',
          style: '--font-primary-style'
        },
        secondary: {
          family: '--font-secondary-family',
          weight: '--font-secondary-weight',
          style: '--font-secondary-style'
        }
      }
    });
    
    const handleFontChange = (e: CustomEvent) => {
      console.log('Font changed:', e.detail);
    };
    
    window.addEventListener('stylizer-font-changed', handleFontChange);
    
    return () => {
      window.removeEventListener('stylizer-font-changed', handleFontChange);
    };
  }, []);
  
  return (
    <div>
      <h1>My React App</h1>
    </div>
  );
}
```

### Svelte

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { Stylizer } from 'jsg-stylizer';
  
  onMount(() => {
    Stylizer.configure({
      fonts: {
        primary: 'Roboto',
        secondary: 'Open Sans'
      },
      cssVariables: {
        primary: {
          family: '--font-primary-family',
          weight: '--font-primary-weight',
          style: '--font-primary-style'
        },
        secondary: {
          family: '--font-secondary-family',
          weight: '--font-secondary-weight',
          style: '--font-secondary-style'
        }
      }
    });
    
    const handleFontChange = (e: CustomEvent) => {
      console.log('Font changed:', e.detail);
    };
    
    window.addEventListener('stylizer-font-changed', handleFontChange);
    
    return () => {
      window.removeEventListener('stylizer-font-changed', handleFontChange);
    };
  });
</script>

<h1>My Svelte App</h1>
```

### Vue 3

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { Stylizer } from 'jsg-stylizer';

let handleFontChange: ((e: CustomEvent) => void) | null = null;

onMounted(() => {
  Stylizer.configure({
    fonts: {
      primary: 'Roboto',
      secondary: 'Open Sans'
    },
    cssVariables: {
      primary: {
        family: '--font-primary-family',
        weight: '--font-primary-weight',
        style: '--font-primary-style'
      },
      secondary: {
        family: '--font-secondary-family',
        weight: '--font-secondary-weight',
        style: '--font-secondary-style'
      }
    }
  });
  
  handleFontChange = (e: CustomEvent) => {
    console.log('Font changed:', e.detail);
  };
  
  window.addEventListener('stylizer-font-changed', handleFontChange as EventListener);
});

onUnmounted(() => {
  if (handleFontChange) {
    window.removeEventListener('stylizer-font-changed', handleFontChange as EventListener);
  }
});
</script>

<template>
  <div>
    <h1>My Vue App</h1>
  </div>
</template>
```

### Astro

```astro
---
import { Stylizer } from 'jsg-stylizer';

if (import.meta.env.DEV) {
  Stylizer.configure({
    fonts: {
      primary: 'Sansation',
      secondary: 'Michroma'
    },
    cssVariables: {
      primary: {
        family: '--font-primary-family',
        weight: '--font-primary-weight',
        style: '--font-primary-style'
      },
      secondary: {
        family: '--font-secondary-family',
        weight: '--font-secondary-weight',
        style: '--font-secondary-style'
      }
    },
    googleApiKey: import.meta.env.PUBLIC_GOOGLE_FONTS_API_KEY
  });
}
---

<h1>My Astro Site</h1>
```

## 📚 API Documentation

### Configuration

Configure Stylizer using the `Stylizer.configure()` method:

```typescript
import { Stylizer } from 'jsg-stylizer';

Stylizer.configure({
  fonts?: {
    primary?: string;      // Default: "Changa One"
    secondary?: string;    // Default: "Nova Square"
  };
  cssVariables?: {
    primary?: {
      family?: string;    // Default: "--font-primary-family"
      weight?: string;    // Default: "--font-primary-weight"
      style?: string;     // Default: "--font-primary-style"
    } | string;           // Legacy: string for backward compat
    secondary?: {
      family?: string;    // Default: "--font-secondary-family"
      weight?: string;    // Default: "--font-secondary-weight"
      style?: string;     // Default: "--font-secondary-style"
    } | string;           // Legacy: string for backward compat
  };
  theme?: {
    background?: string;
    text?: string;
    accent?: string;
    border?: string;
    surface?: string;
    textSecondary?: string;
  };
  googleApiKey?: string;  // Required for Browse All mode
  previewText?: string;    // Default: "The quick brown fox jumps over the lazy dog"
});
```

### Methods

```typescript
const instance = Stylizer.getInstance();

// Get current font state
const fonts = instance.getFonts();
// Returns: { primary: { family, weight, italic }, secondary: { ... } }

// Get current configuration
const config = instance.getConfig();

// Open font picker programmatically
await instance.openFontPicker('primary', 'curated');  // or 'secondary', 'all'

// Reset fonts to defaults
await instance.reset();

// Destroy instance and cleanup
instance.destroy();
```

### Events

Listen to custom events on the `window` object:

```typescript
// Font changed event
window.addEventListener('stylizer-font-changed', (e: CustomEvent) => {
  console.log('Font type:', e.detail.fontType);        // 'primary' | 'secondary'
  console.log('Font family:', e.detail.fontFamily);   // 'Roboto'
  console.log('Weight:', e.detail.weight);             // 100-900
  console.log('Italic:', e.detail.italic);              // boolean
  console.log('CSS variables:', e.detail.cssVariables); // { family, weight, style }
});

// Font reset event
window.addEventListener('stylizer-font-reset', (e: CustomEvent) => {
  console.log('Primary:', e.detail.primaryFont);
  console.log('Secondary:', e.detail.secondaryFont);
});
```

## 🎨 Theme Integration

Stylizer uses CSS variables for theme integration. Define these in your theme:

```css
:root {
  /* Required for fonts - separate variables for family, weight, and style */
  --font-primary-family: "Changa One", sans-serif;
  --font-primary-weight: 400;
  --font-primary-style: normal;
  --font-secondary-family: "Nova Square", sans-serif;
  --font-secondary-weight: 400;
  --font-secondary-style: normal;
  
  /* Optional: Customize Stylizer DevTools sidebar appearance */
  --stylizer-background: #ffffff;
  --stylizer-text: #000000;
  --stylizer-accent: #3b82f6;
  --stylizer-border: #e5e7eb;
  --stylizer-surface: #f9fafb;
  --stylizer-text-secondary: #6b7280;
}

/* Apply fonts */
body {
  font-family: var(--font-primary-family);
  font-weight: var(--font-primary-weight);
  font-style: var(--font-primary-style);
}

h1, h2, h3 {
  font-family: var(--font-secondary-family);
  font-weight: var(--font-secondary-weight);
  font-style: var(--font-secondary-style);
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

## 🛠️ DevTools Sidebar

Stylizer includes a DevTools sidebar that slides in from the right side of the screen:

- **Visible by default** - Opens automatically when configured
- **Collapsible** - Click the X button to collapse to a small button in the top-right corner
- **Persistent state** - Collapsed/expanded state persists across page reloads
- **Font selection** - Click buttons to open font picker modal
- **Live preview** - See font changes in real-time

The sidebar is automatically mounted when you call `Stylizer.configure()`. It provides an easy way to experiment with fonts during development.

## 🔑 Google Fonts API Key

**Curated Mode** (default) works without an API key - it uses 38 pre-selected fonts.

**Browse All Mode** requires a free Google Fonts API key to access all 1500+ fonts:

1. Visit [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project
3. Enable "Google Fonts Developer API"
4. Create an API key
5. Pass it to the configuration:

```typescript
Stylizer.configure({
  googleApiKey: 'YOUR_API_KEY_HERE'
});
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
- [GitHub Repository](https://github.com/crimsonsunset/jsg-stylizer)
- [JSFontPicker](https://www.jsfontpicker.com/) (underlying font picker library)
- [JSG Logger](https://www.npmjs.com/package/@crimsonsunset/jsg-logger)

---

Made with ❤️ by [JSG Tech Check](https://jsg-tech-check.com)
