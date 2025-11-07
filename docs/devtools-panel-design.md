# DevTools Panel Design for JSG Stylizer

## Overview

The goal is to replace the existing dropdown-based font selection UI with a modern slide-in DevTools panel that provides a better developer experience for font selection and theme preview.

## Design Goals

### User Experience
- **Slide-in Panel**: A panel that slides in from the right side of the screen, similar to browser DevTools
- **Always Available**: The panel should be accessible whenever the component is in development mode
- **Auto-open**: Panel opens automatically on page load for immediate visibility
- **Persistent State**: Font selections and panel state should persist across interactions

### Visual Design
- **Modern UI**: Built with Preact and Evergreen UI for a polished, consistent interface
- **Clear Hierarchy**: Font selection controls should be clearly organized with primary and secondary fonts displayed separately
- **Live Updates**: Panel should update in real-time when fonts are changed, matching the demo page display
- **Theme Preview**: Display current CSS variable values for theme customization

### Font Display Format
- **Simplified Display**: Shows font weight only (removed font name for cleaner UI)
- **Reactive Updates**: Display updates immediately when fonts are changed via the picker
- **Theme Preview**: Shows actual font format: "Primary Font: Changa One | 400" / "Secondary Font: Nova Square | 400"
- **Sticky Preview**: Theme preview section sticky to bottom of sidebar for always-visible reference

## Architecture Approach

### Technology Stack
- **Preact**: Lightweight React alternative for the DevTools UI components ✅ Implemented
- **Evergreen UI**: Component library for consistent, accessible UI elements ✅ Implemented
- **Vite**: Build tool configured with Preact plugin and JSX support ✅ Implemented

### Component Structure
- **CollapsedButton**: Small button in top-right corner when sidebar is collapsed (positioned to left of GitHub button)
- **Sidebar**: Main container with collapse/expand logic and state management
- **SidebarHeader**: Sticky header with title and close (X) button
- **FontSection**: Primary/secondary font sections with side-by-side buttons
- **FontDetails**: Component displaying font weight only (font name removed)
- **ThemePreview**: Component showing current font selections (sticky to bottom)

### Integration Points
- **Event Listeners**: Sidebar listens to `stylizer-font-changed` events from window
- **State Management**: Tracks both primary and secondary font data (family, weight, italic) using Preact hooks
- **Lifecycle**: Sidebar mounts/unmounts via `mountSidebar()` method in Stylizer class
- **Positioning**: Font picker modal positioned top-left with higher z-index than sidebar
- **Collapsed State**: Persists sidebar collapsed/expanded state to localStorage

## Key Features

### Font Selection
- Separate buttons for selecting primary and secondary fonts
- Buttons arranged side-by-side (Title Case: "Browse Curated Font List", "Browse All Google Fonts")
- Font weight displayed only (font name removed for cleaner UI)
- Mode buttons support both Curated (38 fonts) and Browse All (1500+ fonts) modes

### Panel Behavior
- Slides in from right with smooth animation
- Sticky header with close button
- Scrollable content area for font controls
- Theme preview sticky to bottom (always visible)
- Close button collapses to small button in top-right corner
- Small button reopens full sidebar
- Collapsed button positioned to left of GitHub button to avoid overlap

### Font Picker Modal
- Positioned at top-left corner (20px from edges)
- Higher z-index than DevTools panel to ensure visibility
- Opens when font selection buttons are clicked

## Implementation Notes

### State Management
- Font data stored separately for primary and secondary fonts (family, weight, italic)
- Updates triggered by `stylizer-font-changed` window events
- Default fonts: Changa One (primary), Nova Square (secondary)
- Sidebar collapsed state persisted to localStorage

### Styling
- Dark theme matching the overall design system
- CSS animations for slide-in/slide-out transitions
- Responsive layout considerations for panel width

### Development Mode
- Panel available via `Stylizer.configure()` API (config-driven)
- Integrated into main Stylizer package (not tree-shakeable)
- DevTools code lives within the `jsg-stylizer` package structure
- Demo page improvements: header layout (75px height), text formatting, removed theme toggle

## Future Considerations

- Consider making panel position configurable
- Add ability to export/import font configurations
- Potential for additional debugging tools beyond font selection
- Integration with other JSG DevTools panels for unified developer experience

