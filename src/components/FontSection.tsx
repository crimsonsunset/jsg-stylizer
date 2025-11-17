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
  onSelectFont: (fontType: FontType, mode: FontMode, curatedFonts?: string[]) => void;
  onModeChange?: (mode: FontMode) => void;
  hasApiKey: boolean;
  curatedFonts?: string[];
  label?: string;
}

/**
 * Font section component for font selection
 */
export function FontSection({
  fontType,
  fontFamily,
  weight,
  numeric,
  mode,
  onSelectFont,
  hasApiKey,
  curatedFonts,
  label: propLabel
}: FontSectionProps) {
  const label = propLabel ?? (fontType === 'primary' ? 'Primary Font' : fontType === 'secondary' ? 'Secondary Font' : fontType);

  return (
    <Pane paddingX={16} paddingY={12} borderBottom="muted">
      <Heading size={400} marginBottom={12} color="#FFFFFF">
        {label}
      </Heading>

      <Pane display="flex" flexDirection="row" gap={8}>
        <Button
          appearance="primary"
          onClick={() => onSelectFont(fontType, 'curated', curatedFonts)}
          flex={1}
        >
          Browse Curated Font List
        </Button>
        <Button
          appearance="primary"
          onClick={() => onSelectFont(fontType, 'all', curatedFonts)}
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

