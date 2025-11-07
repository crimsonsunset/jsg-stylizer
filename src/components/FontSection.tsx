/**
 * FontSection - Font selection UI with primary/secondary sections
 */

import { Pane, Button, Heading } from 'evergreen-ui';
import type { FontType, FontMode } from '../types';

interface FontSectionProps {
  fontType: FontType;
  fontFamily: string;
  weight?: string;
  numeric?: number;
  mode: FontMode;
  onSelectFont: (fontType: FontType, mode: FontMode) => void;
  onModeChange: (mode: FontMode) => void;
  hasApiKey: boolean;
}

/**
 * Font section component for primary or secondary font selection
 */
export function FontSection({
  fontType,
  fontFamily,
  weight,
  numeric,
  mode,
  onSelectFont,
  onModeChange,
  hasApiKey
}: FontSectionProps) {
  const label = fontType === 'primary' ? 'Primary Font' : 'Secondary Font';
  const buttonText = fontType === 'primary' ? 'Select Primary Font' : 'Select Secondary Font';

  return (
    <Pane paddingX={16} paddingY={12} borderBottom="muted">
      <Heading size={400} marginBottom={8} color="#FFFFFF">
        {label}
      </Heading>

      <Pane display="flex" flexDirection="column" gap={8}>
        <Button
          appearance="primary"
          onClick={() => onSelectFont(fontType, 'curated')}
          width="100%"
        >
          browse curated font list
        </Button>
        <Button
          appearance="primary"
          onClick={() => onSelectFont(fontType, 'all')}
          width="100%"
          disabled={!hasApiKey}
          title={!hasApiKey ? 'Browse All mode requires Google Fonts API key' : ''}
        >
          browse all google fonts
        </Button>
        {!hasApiKey && (
          <Pane fontSize={11} color="muted" marginTop={-4}>
            API key required for Browse All mode
          </Pane>
        )}
      </Pane>
    </Pane>
  );
}

