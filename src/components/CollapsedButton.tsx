/**
 * CollapsedButton - Small button shown when sidebar is collapsed
 * Positioned in top-right corner, opens sidebar on click
 */

import { IconButton, MenuIcon } from 'evergreen-ui';
import './styles.css';

interface CollapsedButtonProps {
  onClick: () => void;
}

/**
 * Collapsed button component - small icon button in top-right corner
 */
export function CollapsedButton({ onClick }: CollapsedButtonProps) {
  return (
    <IconButton
      icon={MenuIcon}
      appearance="minimal"
      intent="none"
      onClick={onClick}
      className="stylizer-collapsed-button"
      aria-label="Open Stylizer sidebar"
      title="Open Stylizer sidebar"
    />
  );
}

