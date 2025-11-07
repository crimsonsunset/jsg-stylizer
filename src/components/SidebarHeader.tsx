/**
 * SidebarHeader - Sticky header with title and close button
 */

import { Pane, Heading, IconButton, useTheme, CrossIcon } from 'evergreen-ui';

interface SidebarHeaderProps {
  onClose: () => void;
}

/**
 * Sidebar header component with title and close button
 */
export function SidebarHeader({ onClose }: SidebarHeaderProps) {
  const theme = useTheme();
  const backgroundColor = (theme.colors as any)?.background?.tint1 || '#1E1E1E';
  const textColor = (theme.colors as any)?.text?.default || '#FFFFFF';
  const borderColor = (theme.colors as any)?.border?.muted || '#2A2A2A';

  return (
    <Pane
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding={16}
      borderBottom={`1px solid ${borderColor}`}
      position="sticky"
      top={0}
      backgroundColor={backgroundColor}
      color={textColor}
      zIndex={1}
    >
      <Heading size={500} color={textColor}>Stylizer</Heading>
      <IconButton
        icon={CrossIcon}
        appearance="minimal"
        intent="none"
        onClick={onClose}
        aria-label="Close sidebar"
        title="Close sidebar"
        color={textColor}
      />
    </Pane>
  );
}

