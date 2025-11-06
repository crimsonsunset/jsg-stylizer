# Stylizer Preact Rewrite Roadmap

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

### Phase 1: Foundation & Config System

**Goal**: Set up Preact app structure and config API

**Tasks**:
1. Update `package.json` - Add Preact, Evergreen UI dependencies
2. Update `vite.config.ts` - Add Preact plugin, JSX support
3. Update `tsconfig.json` - Configure JSX for Preact
4. Create `src/Stylizer.ts` - Main class with `configure()` method
5. Create `src/config.ts` - Config type definitions and defaults
6. Update `src/index.ts` - Export `Stylizer` class, auto-initialize

**Files to Create**:
- `src/Stylizer.ts` - Main orchestrator class
- `src/config.ts` - Configuration types and defaults
- `src/components/` - Directory for Preact components

**Files to Modify**:
- `package.json` - Add Preact dependencies
- `vite.config.ts` - Preact plugin
- `tsconfig.json` - JSX config
- `src/index.ts` - New export structure

**Files to Remove**:
- `src/template.ts` - No longer needed (Preact handles rendering)
- Web Component specific code in `Stylizer.ts`

### Phase 2: Sidebar Component (Preact)

**Goal**: Build the main sidebar UI with Preact, including collapse/expand behavior

**Tasks**:
1. Create `src/components/Sidebar.tsx` - Main sidebar container with collapse/expand state
2. Create `src/components/SidebarHeader.tsx` - Sticky header with title and close (X) button
3. Create `src/components/CollapsedButton.tsx` - Small button in top-right when collapsed
4. Create `src/components/FontSection.tsx` - Primary/secondary font sections
5. Create `src/components/FontDetails.tsx` - Display font info (`FontFamily | Weight | Numeric`)
6. Create `src/components/ThemePreview.tsx` - CSS variable display
7. Create `src/components/styles.css` - Sidebar styles (slide-in animation, collapsed button styles)
8. Mount Preact app to DOM in `Stylizer.ts`

**Files to Create**:
- `src/components/Sidebar.tsx` - Main container with collapse/expand logic
- `src/components/SidebarHeader.tsx` - Header with X button
- `src/components/CollapsedButton.tsx` - Small button when sidebar is collapsed
- `src/components/FontSection.tsx` - Primary/secondary font sections
- `src/components/FontDetails.tsx` - Display font info
- `src/components/ThemePreview.tsx` - CSS variable display
- `src/components/styles.css` - Sidebar and collapsed button styles

**Key Features**:
- Visible by default on page load
- Slide-in from right animation
- Sticky header with close (X) button
- Close button collapses to small button in top-right corner
- Small button reopens full sidebar
- Scrollable content area
- Font selection buttons (primary/secondary)
- Real-time font display updates
- Theme preview at bottom

### Phase 3: Font Picker Integration

**Goal**: Integrate JSFontPicker modal with sidebar

**Tasks**:
1. Keep JSFontPicker integration from existing code
2. Create hidden button element for JSFontPicker attachment
3. Wire sidebar buttons to trigger font picker
4. Handle font selection events
5. Update sidebar state when fonts change
6. Position modal top-left (existing CSS overrides)

**Files to Modify**:
- `src/Stylizer.ts` - Add font picker initialization
- `src/components/FontSection.tsx` - Add click handlers
- `src/Stylizer.styles.ts` - Keep modal positioning styles

**Key Features**:
- Font picker opens when sidebar buttons clicked
- Modal positioned top-left
- Font changes update sidebar immediately
- Format: `FontFamily | Weight | Numeric` display

### Phase 4: State Management & Events

**Goal**: Implement reactive state and event system

**Tasks**:
1. Use Preact hooks (`useState`, `useEffect`) for state
2. Track sidebar collapsed/expanded state (persist to localStorage)
3. Track primary/secondary font data (family, weight, numeric)
4. Listen to JSFontPicker `pick` events
5. Emit custom `font-changed` events for external listeners
6. Update CSS variables when fonts change
7. Persist font selections (localStorage optional)

**Files to Modify**:
- `src/components/Sidebar.tsx` - Add state management
- `src/components/FontSection.tsx` - Handle font changes
- `src/Stylizer.ts` - Event emission logic

**Key Features**:
- Reactive updates when fonts change
- Custom events for framework integration
- CSS variable updates
- State persistence (sidebar state + font selections)

### Phase 5: Configuration API

**Goal**: Complete config-driven API

**Tasks**:
1. Finalize `Stylizer.configure()` API
2. Support font defaults, CSS variables, theme mapping
3. Handle config updates (reconfigure)
4. Add public methods: `getFonts()`, `reset()`, `destroy()`
5. Document config options
6. Add TypeScript types for config

**Files to Modify**:
- `src/Stylizer.ts` - Config API implementation
- `src/config.ts` - Config types
- `src/index.ts` - Export config types

**Config Structure**:
```typescript
interface StylizerConfig {
  fonts?: {
    primary?: string;
    secondary?: string;
  };
  cssVariables?: {
    primary?: string;
    secondary?: string;
  };
  theme?: {
    background?: string;
    text?: string;
    accent?: string;
    // ... other theme vars
  };
  googleApiKey?: string;
  previewText?: string;
}
```

### Phase 6: Cleanup & Migration

**Goal**: Remove Web Component code, update docs

**Tasks**:
1. Remove all Web Component code
2. Remove Shadow DOM styles (keep global styles for modal)
3. Update README with new API
4. Update demo site examples
5. Remove unused files
6. Update package exports

**Files to Remove**:
- Web Component lifecycle code
- Shadow DOM template system
- Attribute handling code
- Component instance management

**Files to Update**:
- `README.md` - New API documentation
- `demo/index.html` - New usage examples
- `demo/scripts/demo.js` - Update to use config API

### Phase 7: Testing & Polish

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

**Key Tests**:
- Config API works
- Sidebar mounts correctly (visible by default)
- Collapse/expand works (X button → small button → reopen)
- Font picker integration works
- Events fire correctly
- CSS variables update
- No framework conflicts
- State persists across page reloads

## Future Phases (Post-Rewrite)

### Phase 8: Color Support (Future)
- Add color picker to sidebar
- Control existing CSS variables
- Color preview in theme section
- Color presets

### Phase 9: Advanced Features (Future)
- Export/import configurations
- Font pairing suggestions
- Performance metrics
- A11y improvements

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

- [ ] Sidebar mounts and displays correctly (visible by default)
- [ ] Collapse/expand works (X button → small button → reopen)
- [ ] Config API works as documented
- [ ] Font picker integration functional
- [ ] Font changes update sidebar in real-time
- [ ] CSS variables update correctly
- [ ] Works in all target frameworks
- [ ] No Web Component code remains
- [ ] Bundle size reasonable (< 50KB gzipped)
- [ ] Documentation complete
- [ ] Demo site updated
- [ ] State persists across reloads

## Timeline Estimate

- **Phase 1**: 1-2 days (Foundation)
- **Phase 2**: 2-3 days (Sidebar UI + collapse/expand)
- **Phase 3**: 1-2 days (Font Picker)
- **Phase 4**: 1-2 days (State/Events)
- **Phase 5**: 1 day (Config API)
- **Phase 6**: 1 day (Cleanup)
- **Phase 7**: 2-3 days (Testing)

**Total**: ~10-15 days

## Notes

- Keep existing constants and font lists
- JSFontPicker integration approach stays the same
- Theme concepts transfer directly
- Demo site structure mostly reusable
- Build setup needs Preact plugin addition
- Collapsed button should be small, unobtrusive, top-right positioned

