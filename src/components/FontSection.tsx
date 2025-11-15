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
  onModeChange?: (mode: FontMode) => void;
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
  hasApiKey
}: FontSectionProps) {
  const label = fontType === 'primary' ? 'Primary Font' : 'Secondary Font';

  return (
    <Pane paddingX={16} paddingY={12} borderBottom="muted">
      <Heading size={400} marginBottom={12} color="#FFFFFF">
        {label}
      </Heading>

      <Pane display="flex" flexDirection="row" gap={8}>
        <Button
          appearance="primary"
          onClick={() => onSelectFont(fontType, 'curated')}
          flex={1}
        >
          Browse Curated Font List
        </Button>
        <Button
          appearance="primary"
          onClick={() => onSelectFont(fontType, 'all')}
          flex={1}
          disabled={!hasApiKey}
          title={!hasApiKey ? 'Browse All mode requires Google Fonts API key' : ''}
        >
          Browse All Google Fonts
        </Button>
      </Pane>
      {!hasApiKey && (
        <Pane fontSize={11} color="muted" marginTop={8}>
          API key required for Browse All mode
        </Pane>
      )}
    </Pane>
  );
}

