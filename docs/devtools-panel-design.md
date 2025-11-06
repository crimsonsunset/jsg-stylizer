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
- **Consistent Formatting**: Match the demo page's font detail format: `FontFamily | Weight | Numeric`
- **Reactive Updates**: Display should update immediately when fonts are changed via the picker
- **Preview Text**: Show preview text in the selected font for both primary and secondary fonts

## Architecture Approach

### Technology Stack
- **Preact**: Lightweight React alternative for the DevTools UI components
- **Evergreen UI**: Component library for consistent, accessible UI elements
- **React-Draggable**: For the floating button that triggers the panel
- **Vite**: Build tool configured with Preact plugin and JSX support

### Component Structure
- **FloatingButton**: Draggable 3x3 grid widget that acts as the entry point
- **DevToolsPanel**: Main orchestrator managing panel state and font data
- **PanelContainer**: Slide-in panel with sticky header and scrollable content
- **FontDetails**: Component displaying font information in the standardized format
- **ThemePreview**: Component showing current CSS variable values

### Integration Points
- **Event Listeners**: Panel listens to `font-changed` events from the Stylizer component
- **State Management**: Tracks both primary and secondary font data (family, weight, numeric weight)
- **Lifecycle**: Panel mounts/unmounts with the Web Component lifecycle
- **Positioning**: Font picker modal positioned top-left with higher z-index than panel

## Key Features

### Font Selection
- Separate buttons for selecting primary and secondary fonts
- Each font type displays its current selection with full details
- Format matches demo page: `FontFamily | Weight | Numeric`

### Panel Behavior
- Slides in from right with smooth animation
- Sticky header with close button
- Scrollable content area for font controls and theme preview
- Floating button can be dragged to different screen positions

### Font Picker Modal
- Positioned at top-left corner (20px from edges)
- Higher z-index than DevTools panel to ensure visibility
- Opens when font selection buttons are clicked

## Implementation Notes

### State Management
- Font data stored separately for primary and secondary fonts
- Updates triggered by `font-changed` events from Stylizer component
- Default values match demo page defaults (Zen Tokyo Zoo, Noto Sans SC)

### Styling
- Dark theme matching the overall design system
- CSS animations for slide-in/slide-out transitions
- Responsive layout considerations for panel width

### Development Mode
- Panel only available when `is-development` attribute is set
- Integrated into main Stylizer package (not tree-shakeable)
- DevTools code lives within the `jsg-stylizer` package structure

## Future Considerations

- Consider making panel position configurable
- Add ability to export/import font configurations
- Potential for additional debugging tools beyond font selection
- Integration with other JSG DevTools panels for unified developer experience

