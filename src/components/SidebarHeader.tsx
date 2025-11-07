/**
 * SidebarHeader - Sticky header with title and close button
 */

import { Pane, Heading, IconButton } from 'evergreen-ui';

interface SidebarHeaderProps {
  onClose: () => void;
}

/**
 * Sidebar header component with title and close button
 */
export function SidebarHeader({ onClose }: SidebarHeaderProps) {
  return (
    <Pane
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding={16}
      borderBottom="muted"
      position="sticky"
      top={0}
      background="tint1"
      zIndex={1}
    >
      <Heading size={500} color="default">Stylizer</Heading>
      <IconButton
        icon="cross"
        appearance="minimal"
        intent="none"
        onClick={onClose}
        aria-label="Close sidebar"
        title="Close sidebar"
        color="default"
      />
    </Pane>
  );
}

