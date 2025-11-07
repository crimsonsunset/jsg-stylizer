/**
 * Sidebar - Main sidebar container with collapse/expand functionality
 * Manages state, listens to font change events, and renders all sidebar components
 */

import { useState, useEffect } from 'preact/hooks';
import { render } from 'preact';
import { ThemeProvider, Pane, useTheme } from 'evergreen-ui';
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

  // Manage body class for content push animation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!isCollapsed) {
      document.body.classList.add('stylizer-sidebar-open');
      document.body.classList.remove('stylizer-sidebar-closing');
    } else {
      document.body.classList.remove('stylizer-sidebar-open');
      document.body.classList.add('stylizer-sidebar-closing');
      // Remove closing class after animation completes
      setTimeout(() => {
        document.body.classList.remove('stylizer-sidebar-closing');
      }, 300);
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('stylizer-sidebar-open');
      document.body.classList.remove('stylizer-sidebar-closing');
    };
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
      <ThemeProvider value={darkTheme as any}>
        {<CollapsedButton onClick={handleOpen} /> as any}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={darkTheme as any}>
      {<SidebarContent
        config={config}
        fonts={fonts}
        primaryMode={primaryMode}
        secondaryMode={secondaryMode}
        onClose={handleClose}
        onSelectFont={handleSelectFont}
        onPrimaryModeChange={setPrimaryMode}
        onSecondaryModeChange={setSecondaryMode}
        hasApiKey={hasApiKey}
      /> as any}
    </ThemeProvider>
  );
}

interface SidebarContentProps {
  config: InternalConfig;
  fonts: { primary: string; secondary: string };
  primaryMode: FontMode;
  secondaryMode: FontMode;
  onClose: () => void;
  onSelectFont: (fontType: FontType, mode: FontMode) => void;
  onPrimaryModeChange: (mode: FontMode) => void;
  onSecondaryModeChange: (mode: FontMode) => void;
  hasApiKey: boolean;
}

/**
 * Sidebar content component that uses theme hook
 */
function SidebarContent({
  config,
  fonts,
  primaryMode,
  secondaryMode,
  onClose,
  onSelectFont,
  onPrimaryModeChange,
  onSecondaryModeChange,
  hasApiKey
}: SidebarContentProps) {
  const theme = useTheme();
  const backgroundColor = (theme.colors as any)?.background?.tint1 || '#1E1E1E';
  const textColor = (theme.colors as any)?.text?.default || '#FFFFFF';

  return (
    <Pane
      position="fixed"
      top={0}
      right={0}
      width={400}
      height="100vh"
      backgroundColor={backgroundColor}
      color={textColor}
      elevation={3}
      display="flex"
      flexDirection="column"
      className="stylizer-sidebar stylizer-sidebar-container"
    >
      <SidebarHeader onClose={onClose} />
      
      <Pane flex={1} overflowY="auto">
        <FontSection
          fontType="primary"
          fontFamily={fonts.primary}
          mode={primaryMode}
          onSelectFont={onSelectFont}
          onModeChange={onPrimaryModeChange}
          hasApiKey={hasApiKey}
        />
        
        <FontSection
          fontType="secondary"
          fontFamily={fonts.secondary}
          mode={secondaryMode}
          onSelectFont={onSelectFont}
          onModeChange={onSecondaryModeChange}
          hasApiKey={hasApiKey}
        />
        
        <ThemePreview config={config} />
      </Pane>
    </Pane>
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
