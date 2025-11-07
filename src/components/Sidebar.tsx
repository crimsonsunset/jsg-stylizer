/**
 * Sidebar - Main sidebar container with collapse/expand functionality
 * Manages state, listens to font change events, and renders all sidebar components
 */

import { useState, useEffect } from 'preact/hooks';
import { render } from 'preact';
import { ThemeProvider, Pane } from 'evergreen-ui';
import { SidebarHeader } from './SidebarHeader';
import { CollapsedButton } from './CollapsedButton';
import { FontSection } from './FontSection';
import { ThemePreview } from './ThemePreview';
import { Stylizer } from '../Stylizer';
import type { FontType, FontMode } from '../types';
import type { InternalConfig } from '../config';
import { darkTheme } from './theme';
import './styles.css';

interface SidebarProps {
  config: InternalConfig;
  initialFonts: {
    primary: string;
    secondary: string;
  };
}

const STORAGE_KEY = 'stylizer-sidebar-collapsed';

/**
 * Main sidebar component
 */
function Sidebar({ config, initialFonts }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'true';
  });
  
  const [fonts, setFonts] = useState(initialFonts);
  const [primaryMode, setPrimaryMode] = useState<FontMode>('curated');
  const [secondaryMode, setSecondaryMode] = useState<FontMode>('curated');

  // Listen to font change events
  useEffect(() => {
    const handleFontChange = (event: CustomEvent) => {
      const detail = event.detail;
      setFonts(prev => ({
        ...prev,
        [detail.fontType]: detail.fontFamily
      }));
    };

    window.addEventListener('stylizer-font-changed', handleFontChange as EventListener);
    
    return () => {
      window.removeEventListener('stylizer-font-changed', handleFontChange as EventListener);
    };
  }, []);

  // Persist collapsed state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, isCollapsed.toString());
    }
  }, [isCollapsed]);

  const handleClose = () => {
    setIsCollapsed(true);
  };

  const handleOpen = () => {
    setIsCollapsed(false);
  };

  const handleSelectFont = (fontType: FontType, mode: FontMode) => {
    const instance = Stylizer.getInstance();
    instance.openFontPicker(fontType, mode);
  };

  const hasApiKey = !!config.googleApiKey;

  if (isCollapsed) {
    return (
      <ThemeProvider value={darkTheme}>
        <CollapsedButton onClick={handleOpen} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={darkTheme}>
      <Pane
        position="fixed"
        top={0}
        right={0}
        width={400}
        height="100vh"
        background="tint1"
        elevation={3}
        display="flex"
        flexDirection="column"
        className="stylizer-sidebar stylizer-sidebar-container"
      >
        <SidebarHeader onClose={handleClose} />
        
        <Pane flex={1} overflowY="auto">
          <FontSection
            fontType="primary"
            fontFamily={fonts.primary}
            mode={primaryMode}
            onSelectFont={handleSelectFont}
            onModeChange={setPrimaryMode}
            hasApiKey={hasApiKey}
          />
          
          <FontSection
            fontType="secondary"
            fontFamily={fonts.secondary}
            mode={secondaryMode}
            onSelectFont={handleSelectFont}
            onModeChange={setSecondaryMode}
            hasApiKey={hasApiKey}
          />
          
          <ThemePreview config={config} />
        </Pane>
      </Pane>
    </ThemeProvider>
  );
}

/**
 * Mount sidebar to DOM
 */
export function mountSidebar(config: InternalConfig, initialFonts: { primary: string; secondary: string }): () => void {
  const container = document.createElement('div');
  container.id = 'stylizer-sidebar-root';
  document.body.appendChild(container);

  render(<Sidebar config={config} initialFonts={initialFonts} />, container);

  // Return cleanup function
  return () => {
    render(null, container);
    container.remove();
  };
}

