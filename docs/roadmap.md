# Stylizer Preact Rewrite Roadmap

## Current Status

**Last Updated**: December 2024  
**Current Phase**: Phase 7 Complete ✅ | Phase 8 Next (Robustness Improvements)

### Phase 1: Foundation & Config System ✅ **COMPLETE**

**Completed**: November 6, 2025

**What Was Built**:
- ✅ Preact dependencies added (`preact`, `@preact/preset-vite`)
- ✅ Vite configured with Preact plugin and JSX support
- ✅ TypeScript configured for Preact JSX (`jsx: "react-jsx"`, `jsxImportSource: "preact"`)
- ✅ Config system created (`src/config.ts`) with `StylizerConfig`, `InternalConfig`, `mergeConfig()`, `validateConfig()`
- ✅ Main `Stylizer` class rewritten (singleton pattern, config-driven API)
- ✅ Web Component code removed (HTMLElement, Shadow DOM, lifecycle methods)
- ✅ Font picker integration working (JSFontPicker modal)
- ✅ CSS injection for JSFontPicker working (`injectFontPickerCSS()`)
- ✅ CSS variable updates working
- ✅ Event system working (`stylizer-font-changed`, `stylizer-font-reset`)
- ✅ Public API methods: `configure()`, `getFonts()`, `getConfig()`, `reset()`, `destroy()`
- ✅ `openFontPicker()` method supports both `'curated'` and `'all'` modes
- ✅ Browse All mode backend implemented (requires `googleApiKey` in config)
- ✅ Components directory created (`src/components/`)
- ✅ Main export updated (`src/index.ts` - exports `Stylizer` class, auto-initializes)
- ✅ Template file removed (`src/template.ts`)
- ✅ Types cleaned up (removed Web Component types)
- ✅ Global types updated (event types for window events)

**Additional Work Completed**:
- ✅ JSFontPicker CSS injection from `node_modules/fontpicker/dist/fontpicker.min.css`
- ✅ All functionality tested and verified working

**Browse All Mode Status**:
- ✅ Backend implementation complete - `openFontPicker(fontType, 'all')` works
- ✅ API key validation in place
- ✅ UI controls for Browse All mode added (Phase 2)

**Build Status**:
- ✅ TypeScript compilation: Passing
- ✅ Build: Success (ESM: 64.90 KB, UMD: 215.77 KB)
- ✅ Linting: No errors
- ✅ All success criteria met

**Next**: Phase 7 - Testing & Polish

## Overview

Complete architectural rewrite from Web Component to traditional Preact application. The sidebar is the main product - a config-driven panel that lets users easily change fonts (and eventually colors) on their site.

**Core Value Prop**: A sidebar that lets you change fonts and colors easily, given a config.

## Architecture Shift

### From (Web Component):
```html
<jsg-stylizer is-development="true" default-primary-font="Roboto"></jsg-stylizer>
```
- Custom element with Shadow DOM
- Component lifecycle management
- Attributes + properties API
- Multiple instances possible

### To (Traditional Preact):
```js
import '@jsg/stylizer';
Stylizer.configure({
  fonts: { primary: 'Roboto', secondary: 'Open Sans' },
  cssVariables: { primary: '--font-primary', secondary: '--font-secondary' }
});
```
- Preact app mounted to `document.body`
- Single global instance
- Config-driven via `Stylizer.configure()`
- Sidebar visible by default, collapses to small button

## What's Salvageable

### Keep:
- **Constants** (`constants.ts`) - Font lists, defaults
- **JSFontPicker integration** - Modal approach stays separate
- **Theme concepts** - CSS variable mapping
- **Event system** - Custom events for font changes (simplified)
- **Demo site structure** - Framework examples still relevant
- **Build setup** - Vite config mostly works (add Preact plugin)

### Remove:
- **Web Component code** - `StylizerElement`, `customElements.define`, Shadow DOM
- **Template system** - Preact handles rendering
- **Attribute system** - Config object replaces attributes
- **Component lifecycle** - Preact lifecycle instead
- **Floating button** - Sidebar has collapse/expand instead

## Implementation Phases

### Phase 1: Foundation & Config System ✅ **COMPLETE**

**Status**: ✅ Complete - November 6, 2025  
**Goal**: Set up Preact app structure and config API

**Tasks**:
1. ✅ Update `package.json` - Add Preact dependencies
2. ✅ Update `vite.config.ts` - Add Preact plugin, JSX support
3. ✅ Update `tsconfig.json` - Configure JSX for Preact
4. ✅ Create `src/Stylizer.ts` - Main class with `configure()` method
5. ✅ Create `src/config.ts` - Config type definitions and defaults
6. ✅ Update `src/index.ts` - Export `Stylizer` class, auto-initialize
7. ✅ Remove `src/template.ts` - No longer needed
8. ✅ Clean up Web Component code from `Stylizer.ts`
9. ✅ Add JSFontPicker CSS injection
10. ✅ Implement font picker integration (curated + Browse All modes)

**Files Created**:
- ✅ `src/config.ts` - Configuration types and defaults
- ✅ `src/components/` - Directory for Preact components (empty, ready for Phase 2)

**Files Modified**:
- ✅ `package.json` - Added Preact dependencies
- ✅ `vite.config.ts` - Added Preact plugin
- ✅ `tsconfig.json` - Configured JSX for Preact
- ✅ `src/Stylizer.ts` - Complete rewrite (singleton, config API, font picker integration)
- ✅ `src/index.ts` - New export structure
- ✅ `src/types.ts` - Cleaned up (removed Web Component types)
- ✅ `src/global.d.ts` - Updated (event types)

**Files Removed**:
- ✅ `src/template.ts` - Deleted (Preact handles rendering)

**Key Implementation Details**:
- Singleton pattern implemented (`Stylizer.getInstance()`)
- Config API: `Stylizer.configure(config)` with validation
- Font picker supports both curated (38 fonts) and Browse All (1500+ fonts) modes
- Browse All mode requires `googleApiKey` in config
- CSS injection for JSFontPicker working from node_modules
- Events: `stylizer-font-changed` and `stylizer-font-reset`
- Public methods: `configure()`, `getFonts()`, `getConfig()`, `reset()`, `destroy()`, `openFontPicker()`

**Testing**:
- ✅ Config API tested and working
- ✅ Font picker opens successfully (curated mode)
- ✅ CSS loads correctly
- ✅ Events fire correctly
- ✅ CSS variables update in real-time
- ✅ Reset functionality works

**Notes**:
- Browse All mode backend is complete but no UI controls yet (Phase 2)
- CSS injection uses link tag approach (works in Vite dev server)
- Font picker modal positioning handled by existing global styles

### Phase 2: Sidebar Component (Preact) ✅ **COMPLETE**

**Status**: ✅ Complete - November 6, 2025  
**Goal**: Build the main sidebar UI with Preact, including collapse/expand behavior

**Tasks**:
1. ✅ Create `src/components/Sidebar.tsx` - Main sidebar container with collapse/expand state
2. ✅ Create `src/components/SidebarHeader.tsx` - Sticky header with title and close (X) button
3. ✅ Create `src/components/CollapsedButton.tsx` - Small button in top-right when collapsed
4. ✅ Create `src/components/FontSection.tsx` - Primary/secondary font sections
5. ✅ Create `src/components/ThemePreview.tsx` - CSS variable display (sticky to bottom)
6. ✅ Create `src/components/styles.css` - Sidebar styles (slide-in animation, collapsed button styles)
7. ✅ Mount Preact app to DOM in `Stylizer.ts`

**Files Created**:
- ✅ `src/components/Sidebar.tsx` - Main container with collapse/expand logic
- ✅ `src/components/SidebarHeader.tsx` - Header with X button
- ✅ `src/components/CollapsedButton.tsx` - Small button when sidebar is collapsed
- ✅ `src/components/FontSection.tsx` - Primary/secondary font sections
- ✅ `src/components/ThemePreview.tsx` - CSS variable display
- ✅ `src/components/styles.css` - Sidebar and collapsed button styles
- ✅ `src/components/theme.ts` - Dark theme configuration

**Key Features Implemented**:
- ✅ Visible by default on page load
- ✅ Slide-in from right animation
- ✅ Sticky header with close (X) button
- ✅ Close button collapses to small button in top-right corner
- ✅ Small button reopens full sidebar
- ✅ Scrollable content area
- ✅ Font selection buttons (primary/secondary) - side-by-side layout
- ✅ Mode buttons (Curated / Browse All) - UI for Browse All mode
- ✅ Real-time font display updates
- ✅ Theme preview sticky to bottom of sidebar
- ✅ Font weight display (removed font name from display)
- ✅ Default fonts: Changa One (primary), Nova Square (secondary)
- ✅ Collapsed button positioning (to left of GitHub button when collapsed)

**Additional Improvements**:
- ✅ Buttons arranged side-by-side (Title Case)
- ✅ Font name removed from display (shows weight only)
- ✅ Theme preview displays actual font format: "Primary Font: Changa One | 400"
- ✅ Demo page text format matches sidebar preview
- ✅ Demo page header layout improved (75px height, proper spacing)
- ✅ Theme toggle button removed from demo page

### Phase 3: Font Picker Integration ✅ **COMPLETE**

**Status**: ✅ Complete - November 7, 2025  
**Goal**: Integrate JSFontPicker modal with sidebar

**Tasks**:
1. ✅ Keep JSFontPicker integration from existing code
2. ✅ Create hidden button element for JSFontPicker attachment
3. ✅ Wire sidebar buttons to trigger font picker
4. ✅ Handle font selection events
5. ✅ Update sidebar state when fonts change
6. ✅ Position modal top-left (existing CSS overrides)

**Files Modified**:
- ✅ `src/Stylizer.ts` - Font picker initialization complete
- ✅ `src/components/FontSection.tsx` - Click handlers implemented
- ✅ `src/Stylizer.styles.ts` - Modal positioning styles maintained

**Key Features Implemented**:
- ✅ Font picker opens when sidebar buttons clicked
- ✅ Modal positioned top-left
- ✅ Font changes update sidebar immediately
- ✅ Format: `FontFamily | Weight | Italic` display in ThemePreview

### Phase 4: State Management & Events ✅ **COMPLETE**

**Status**: ✅ Complete - November 7, 2025  
**Goal**: Implement reactive state and event system

**Tasks**:
1. ✅ Use Preact hooks (`useState`, `useEffect`) for state
2. ✅ Track sidebar collapsed/expanded state (persist to localStorage)
3. ✅ Track primary/secondary font data (family, weight, italic)
4. ✅ Listen to JSFontPicker `pick` events
5. ✅ Emit custom `font-changed` events for external listeners
6. ✅ Update CSS variables when fonts change
7. ✅ State persistence (sidebar state persisted to localStorage)

**Files Modified**:
- ✅ `src/components/Sidebar.tsx` - State management implemented with Preact hooks
- ✅ `src/components/FontSection.tsx` - Font change handling complete
- ✅ `src/Stylizer.ts` - Event emission logic implemented

**Key Features Implemented**:
- ✅ Reactive updates when fonts change (via event listeners)
- ✅ Custom events for framework integration (`stylizer-font-changed`, `stylizer-font-reset`)
- ✅ CSS variable updates on font selection
- ✅ State persistence (sidebar collapsed state persisted to localStorage)

### Phase 5: Configuration API ✅ **COMPLETE**

**Status**: ✅ Complete - November 7, 2025  
**Goal**: Complete config-driven API

**Tasks**:
1. ✅ Finalize `Stylizer.configure()` API
2. ✅ Support font defaults, CSS variables, theme mapping
3. ✅ Handle config updates (reconfigure works)
4. ✅ Add public methods: `getFonts()`, `reset()`, `destroy()`
5. ✅ Document config options (README.md complete)
6. ✅ Add TypeScript types for config

**Files Modified**:
- ✅ `src/Stylizer.ts` - Config API implementation complete
- ✅ `src/config.ts` - Config types with validation
- ✅ `src/index.ts` - Config types exported

**Config Structure** (Implemented):
```typescript
interface StylizerConfig {
  fonts?: {
    primary?: string;
    secondary?: string;
  };
  cssVariables?: {
    primary?: FontCSSVariablesConfig | string;  // Legacy string support
    secondary?: FontCSSVariablesConfig | string;
  };
  theme?: {
    background?: string;
    text?: string;
    accent?: string;
    border?: string;
    surface?: string;
    textSecondary?: string;
  };
  googleApiKey?: string;
  previewText?: string;
}
```

**Key Features Implemented**:
- ✅ Config validation with descriptive errors
- ✅ Config merging with defaults
- ✅ Legacy string format support for CSS variables (backward compat)
- ✅ Separate CSS variables for family, weight, and style
- ✅ Public API methods: `configure()`, `getFonts()`, `getConfig()`, `reset()`, `destroy()`

### Phase 6: Cleanup & Migration ✅ **COMPLETE**

**Status**: ✅ Complete - November 7, 2025  
**Goal**: Remove Web Component code, update docs

**Tasks**:
1. ✅ Remove all Web Component code (verified - none found)
2. ✅ Remove Shadow DOM styles (verified - only global styles for modal remain, as intended)
3. ✅ Update README with new API (already complete)
4. ✅ Update demo site examples (verified - matches current API)
5. ✅ Remove unused files (removed test-phase1.html references)
6. ✅ Update package exports (updated package.json description and keywords)

**Files Verified**:
- ✅ No Web Component lifecycle code found
- ✅ No Shadow DOM template system found
- ✅ No attribute handling code found
- ✅ No component instance management code found

**Files Updated**:
- ✅ `package.json` - Updated description and keywords (removed Web Component references)
- ✅ `package.json` - Removed test script for non-existent test-phase1.html
- ✅ `docs/roadmap.md` - Removed test-phase1.html references

### Phase 7: Live Preview Feature ✅ **COMPLETE**

**Status**: ✅ Complete - November 23, 2025  
**Goal**: Add live preview mode that applies font changes in real-time as user browses, with cancel/revert functionality

**Tasks**:
1. ✅ Add `livePreview` config option (boolean, defaults to `false`)
2. ✅ Store original font state before opening picker
3. ✅ Track pick confirmation state
4. ✅ Wire up 'select' event listener to apply fonts immediately when `livePreview` enabled
5. ✅ Implement revert logic on cancel (when picker closed without confirming)
6. ✅ Fix context binding issue in close handler (captured Stylizer instance)
7. ✅ Fix timing issue with modal DOM removal detection
8. ✅ Enable livePreview in demo site

**Files Modified**:
- ✅ `src/config.ts` - Added `livePreview?: boolean` to `StylizerConfig` and `InternalConfig`
- ✅ `src/Stylizer.ts` - Implemented live preview logic with cancel/revert functionality
- ✅ `demo/scripts/stylizer-config.js` - Enabled `livePreview: true` for demo

**Key Features Implemented**:
- ✅ Real-time font changes as user browses fonts (when `livePreview: true`)
- ✅ Cancel/revert functionality - restores original font if picker closed without confirming
- ✅ State tracking - stores original font state before opening, tracks pick confirmation
- ✅ Proper cleanup - reverts font and cleans up state on cancel

**Technical Details**:
- Font state stored before opening picker in `originalFontState` property
- `pickConfirmed` flag tracks whether user clicked select button
- 'select' event listener applies fonts immediately when `livePreview` enabled
- Close handler waits for modal DOM removal before checking revert conditions
- Context binding fixed by capturing Stylizer instance in closure
- ✅ `README.md` - Already updated with new API (verified)
- ✅ `demo/index.html` - Already matches current API (verified)
- ✅ `demo/scripts/demo.js` - Already uses config API (verified)

### Phase 8: Robustness Improvements

**Status**: ⏳ Pending  
**Goal**: Make Stylizer more robust so consuming applications need less setup code. Reduce integration complexity by handling common concerns internally.

**Problem Statement**:
Current integration requires significant setup code:
- Manual localStorage reading before Zustand hydration
- Manual CSS variable application after configuration
- Manual DOM readiness handling
- Manual event listener setup and cleanup
- Manual sync between Stylizer and external state management

**Solution**: Add built-in support for persistence, automatic CSS variable application, and DOM readiness handling.

**Tasks**:

1. **Built-in Persistence Support**
   - Add `persistence` config option to `StylizerConfig`
   - Implement internal localStorage read/write for font choices
   - Automatically restore persisted fonts on `configure()` call
   - Support custom storage key and storage mechanism (localStorage/sessionStorage)
   - Persist font choices automatically when fonts change

2. **Automatic CSS Variable Application**
   - Add `autoApplyCSSVariables` config option (default: `true`)
   - Automatically apply CSS variables to `:root` after `configure()` completes
   - Automatically update CSS variables whenever fonts change
   - Ensure CSS variables persist after configuration (handle SSR/hydration scenarios)
   - Remove need for manual `applyFontsToCSSVariables()` calls in consuming apps

3. **Built-in DOM Readiness Handling**
   - Add `waitForDOM` config option (default: `true`)
   - Automatically wait for `DOMContentLoaded` if DOM not ready
   - Handle SSR/hydration scenarios gracefully
   - Add small delay to ensure all DOM nodes are ready
   - Remove need for manual `waitForDOMReady()` calls in consuming apps

4. **Promise-Based Initialization**
   - Make `Stylizer.configure()` return a Promise
   - Promise resolves when:
     - DOM is ready (if `waitForDOM: true`)
     - Persisted fonts are restored (if `persistence.enabled: true`)
     - CSS variables are applied (if `autoApplyCSSVariables: true`)
     - Event listeners are set up
   - Allows consuming apps to await initialization completion

**Config API Changes**:

```typescript
interface StylizerConfig {
  // ... existing config options
  
  /**
   * Persistence configuration for font choices
   * When enabled, Stylizer automatically saves/restores font choices from storage
   */
  persistence?: {
    enabled?: boolean;           // Default: false (backward compatible)
    storageKey?: string;         // Default: 'stylizer-font-choices'
    storage?: Storage;          // Default: localStorage (can use sessionStorage)
  };
  
  /**
   * Automatically apply CSS variables to :root when fonts change
   * When true, Stylizer handles all CSS variable updates internally
   */
  autoApplyCSSVariables?: boolean;  // Default: true
  
  /**
   * Wait for DOM to be ready before initializing
   * Handles DOMContentLoaded and SSR/hydration scenarios
   */
  waitForDOM?: boolean;          // Default: true
}
```

**Implementation Details**:

**Persistence** (`src/Stylizer.ts`):
- Add `persistFonts()` method - saves current font state to storage
- Add `restoreFonts()` method - reads persisted fonts from storage
- Call `restoreFonts()` at start of `configure()` if `persistence.enabled: true`
- Call `persistFonts()` whenever fonts change (in font picker handlers)
- Use provided storage key or default to `'stylizer-font-choices'`
- Handle storage errors gracefully (fallback to defaults)

**CSS Variable Application** (`src/Stylizer.ts`):
- Add `applyCSSVariables()` method - applies current fonts to CSS variables
- Call `applyCSSVariables()` after `configure()` completes (if `autoApplyCSSVariables: true`)
- Call `applyCSSVariables()` whenever fonts change (in font picker handlers)
- Ensure CSS variables are applied even after page reload/hydration
- Use same CSS variable names from config

**DOM Readiness** (`src/Stylizer.ts`):
- Add `waitForDOMReady()` internal method
- Check `document.readyState` - if `'loading'`, wait for `DOMContentLoaded`
- Add small delay (100ms) to ensure all DOM nodes are ready
- Call at start of `configure()` if `waitForDOM: true`
- Make `configure()` async and await DOM readiness

**Promise-Based API**:
- Make `configure()` return `Promise<void>`
- Await DOM readiness (if enabled)
- Await font restoration (if persistence enabled)
- Apply CSS variables (if auto-apply enabled)
- Resolve promise when all initialization complete

**Files to Modify**:
- `src/Stylizer.ts` - Add persistence, auto-apply, DOM readiness logic
- `src/config.ts` - Add new config options to `StylizerConfig` and `InternalConfig`
- `src/types.ts` - Add persistence config types
- `README.md` - Document new config options and simplified usage

**Benefits**:
- **Reduced Integration Code**: Consuming apps go from ~50 lines to ~5 lines
- **Fewer Manual Steps**: No localStorage reading, no CSS variable application, no DOM readiness handling
- **Better SSR Support**: Handles hydration scenarios automatically
- **Backward Compatible**: All new options have sensible defaults (persistence disabled by default)
- **Framework Agnostic**: Works with any framework, not just React/Zustand

**Example Usage After Implementation**:

**Before** (current - ~50 lines):
```typescript
// Complex setup with hooks, utilities, manual sync
useMount(async () => {
  await waitForDOMReady();
  const persisted = getPersistedFonts();
  const config = createStylizerConfig(...);
  await Stylizer.configure(config);
});
useFontApplication();
useStylizerListener();
```

**After** (with improvements - ~5 lines):
```typescript
await Stylizer.configure({
  fonts: { primary: 'Inter', secondary: 'Space Mono' },
  cssVariables: { /* ... */ },
  persistence: { enabled: true },
  autoApplyCSSVariables: true,
  waitForDOM: true,
});
// That's it! Stylizer handles everything internally
```

**Timeline**: 6-8 hours (1 day)

**Breaking Changes**: None - all new options are optional with backward-compatible defaults

**Testing**:
- Test persistence with localStorage
- Test persistence with sessionStorage
- Test auto-apply CSS variables on init and font changes
- Test DOM readiness handling in SSR scenarios
- Test promise-based initialization
- Verify backward compatibility (existing configs still work)

### Phase 9: CSS Variable Color Selection & Theme Management

**Goal**: Add variable-centric color management with framework presets

**Architecture**: Variable-centric, format-agnostic. Stylizer acts as a CSS Variable Editor (not a theme system interpreter), working with any framework's CSS variables through a simple key-value interface.

**Core Innovation**: Zero transform code - presets are just metadata + templates.

**Tasks**:
1. Install DaisyUI locally to harvest theme CSS values
2. Create script to extract all ~40 DaisyUI themes from node_modules
3. Generate preset definitions from DaisyUI themes
4. Integrate JSColorPicker library (~14.5 KB gzipped)
5. Add Mustache.js for templating (~3-4 KB gzipped) with @types/mustache
6. Create color state management in Stylizer.ts
7. Implement applyColor() method with CSS variable application
8. Build framework preset definitions (Tailwind, Material, Bootstrap, Radix, Generic)
9. Implement import/export system (CSS, JSON, JavaScript)
10. Create UI components (ColorSection, ColorButton, PresetSelector with DaisyUI themes)
11. Update ThemePreview to show color swatches
12. Implement color events (stylizer-color-changed, stylizer-theme-changed)
13. Test all presets and document features

**Main Features**:
- Edit any CSS variable through color pickers
- Framework-agnostic (works with DaisyUI, Tailwind, Material, custom vars)
- Real-time preview in sidebar and page
- Support for alpha/transparency
- Framework presets with export to framework-specific formats
- Import/export: CSS, JSON, JavaScript object

**Files to Create**:
- `scripts/extract-daisy-themes.js` - Extract DaisyUI themes from node_modules
- `src/presets/daisy-themes.json` - Generated DaisyUI theme definitions (~40 themes)
- `src/JSColorPicker.ts` - Integration wrapper
- `src/JSColorPicker.styles.ts` - Dark theme styling
- `src/parsers.ts` - Import parsers
- `src/exporters.ts` - Export logic
- `src/presets/index.ts` - Preset registry (includes DaisyUI themes)
- `src/presets/types.ts` - Preset interfaces
- `src/presets/tailwind.ts` - Tailwind preset structure
- `src/presets/material.ts` - Material Design 3 preset structure
- `src/presets/bootstrap.ts` - Bootstrap 5 preset structure
- `src/presets/radix.ts` - Radix UI preset structure
- `src/presets/generic.ts` - Generic preset structure
- `src/components/ColorSection.tsx` - Main color UI
- `src/components/ColorButton.tsx` - Individual color picker button
- `src/components/PresetSelector.tsx` - Preset dropdown (DaisyUI themes + framework presets)
- `src/components/ImportExportModal.tsx` - Import/export modal

**Files to Modify**:
- `src/Stylizer.ts` - Add color methods
- `src/config.ts` - Extend for color variables
- `src/types.ts` - Add color event types
- `src/constants.ts` - Add preset constants
- `src/global.d.ts` - Color event declarations
- `src/components/Sidebar.tsx` - Integrate ColorSection
- `src/components/ThemePreview.tsx` - Add color swatches
- `src/components/styles.css` - Color section styles
- `package.json` - Add mustache + @types/mustache
- `README.md` - Document color features

**Timeline**: 14-20 hours (2-3 days)

**Dependencies Added**: 
- `daisyui` (dev dependency - for theme extraction only, not bundled)
- `mustache` (~3-4 KB gzipped)
- `@types/mustache` (dev dependency)
- JSColorPicker via CDN or bundled (~14.5 KB gzipped)

**DaisyUI Theme Harvesting Strategy**:
- Install DaisyUI as dev dependency
- Create extraction script (`scripts/extract-daisy-themes.js`)
- Parse DaisyUI theme files from `node_modules/daisyui/src/theming/themes.js`
- Generate JSON preset definitions with all ~40 themes
- Store in `src/presets/daisy-themes.json`
- Allow users to select from dropdown: "light", "dark", "cupcake", "synthwave", etc.
- Apply selected DaisyUI theme to any framework (map to their CSS variables)

### Phase 10: Testing & Polish

**Goal**: Test across frameworks, polish UX

**Tasks**:
1. Test in vanilla JS
2. Test in React
3. Test in Vue
4. Test in Svelte
5. Test in Astro
6. Fix any framework-specific issues
7. Polish animations and transitions
8. Ensure responsive design
9. Test collapse/expand behavior
10. Test localStorage persistence
11. Test color selection features across all presets
12. Verify import/export functionality

**Key Tests**:
- Config API works
- Sidebar mounts correctly (visible by default)
- Collapse/expand works (X button → small button → reopen)
- Font picker integration works
- Color picker integration works
- Events fire correctly
- CSS variables update (fonts + colors)
- No framework conflicts
- State persists across page reloads
- Import/export round-trips work correctly

## Future Phases (Post-Rewrite)

### Phase 11: Custom Preset Creation (Future)
- Users can create/import custom presets
- Preset sharing and export
- Community preset repository

### Phase 12: Advanced Features (Future)
- Font pairing suggestions
- Performance metrics
- A11y improvements
- Advanced color features (gradients, color harmonies)

## Technical Decisions

### Preact over React
- Smaller bundle size (~3KB vs ~40KB)
- Same API, easier migration
- Better for this use case

### Evergreen UI
- Consistent, accessible components
- Works with Preact via compat layer
- Professional look out of the box

### Config-Driven
- Single source of truth
- Easier to reason about
- Better for programmatic control

### Sidebar Visibility Behavior
- Visible by default on page load
- X button collapses sidebar to small button in top-right corner
- Small button reopens full sidebar
- Provides immediate access while allowing users to minimize
- State persists via localStorage

### Font Picker Modal Separate
- JSFontPicker works well as modal
- Keeps sidebar clean
- User preference (from discussion)

## Migration Path

### For Existing Users (if any):
1. Remove `<jsg-stylizer>` element
2. Add `import '@jsg/stylizer'`
3. Call `Stylizer.configure({ ... })`
4. Remove attribute-based config

### Breaking Changes:
- No HTML element API
- Config object required
- Different initialization
- Sidebar visible by default (not hidden)

## Success Criteria

- [x] Config API works as documented ✅ (Phase 1)
- [x] Font picker integration functional ✅ (Phase 1)
- [x] CSS variables update correctly ✅ (Phase 1)
- [x] No Web Component code remains ✅ (Phase 1)
- [x] Sidebar mounts and displays correctly (visible by default) ✅ (Phase 2)
- [x] Collapse/expand works (X button → small button → reopen) ✅ (Phase 2)
- [x] Font changes update sidebar in real-time ✅ (Phase 2)
- [ ] Built-in persistence working ⏳ Phase 8
- [ ] Auto-apply CSS variables working ⏳ Phase 8
- [ ] DOM readiness handling working ⏳ Phase 8
- [ ] Color selection integrated ⏳ Phase 9
- [ ] Framework presets working ⏳ Phase 9
- [ ] Import/export functionality ⏳ Phase 9
- [ ] Works in all target frameworks ⏳ Phase 10
- [ ] Bundle size reasonable (< 80KB gzipped with color features) ⏳ Phase 10
- [ ] Documentation complete ⏳ Phase 8-10
- [x] Demo site updated ✅ (Phase 2 - header, text formatting, layout improvements)
- [x] State persists across reloads ✅ (Phase 2 - localStorage for collapsed state)

## Timeline Estimate

- **Phase 1**: ✅ Complete (November 6, 2025) - 1 day actual
- **Phase 2**: ✅ Complete (November 6, 2025) - 1 day actual
- **Phase 3**: ✅ Complete (November 7, 2025) - Integrated with sidebar
- **Phase 4**: ✅ Complete (November 7, 2025) - State management and events fully implemented
- **Phase 5**: ✅ Complete (November 7, 2025) - Config API finalized
- **Phase 6**: ✅ Complete (November 7, 2025) - Cleanup & migration verified
- **Phase 8**: ⏳ Pending (Robustness Improvements) - 1 day estimated
- **Phase 9**: ⏳ Pending (Color Selection & Theme Management) - 2-3 days estimated
- **Phase 10**: ⏳ Pending (Testing & Polish) - 2-3 days estimated

**Total**: ~13-19 days estimated | ~6 days completed

## Notes

- Keep existing constants and font lists ✅
- JSFontPicker integration approach stays the same ✅
- Theme concepts transfer directly ✅
- Demo site structure mostly reusable ✅
- Build setup needs Preact plugin addition ✅ Done
- Collapsed button should be small, unobtrusive, top-right positioned ✅ Done (positioned to left of GitHub button)
- Browse All mode backend complete, UI controls added ✅ (Phase 2)
- CSS injection working via link tag (Vite dev server serves from node_modules)
- Default fonts updated: Changa One (primary), Nova Square (secondary)
- Font picker integration working - buttons trigger modal correctly
- Theme preview sticky to bottom of sidebar for better UX
- Demo page improvements: header layout (75px height), text formatting, removed theme toggle

