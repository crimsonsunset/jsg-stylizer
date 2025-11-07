/**
 * FontSection - Font selection UI with primary/secondary sections and mode toggle
 */

import { Pane, Button, Text, Heading } from 'evergreen-ui';
import { FontDetails } from './FontDetails';
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
    <Pane padding={16} borderBottom="muted">
      <Heading size={400} marginBottom={12}>
        {label}
      </Heading>
      
      <Pane marginBottom={12}>
        <FontDetails fontFamily={fontFamily} weight={weight} numeric={numeric} />
      </Pane>
      
      <Pane marginBottom={12}>
        <Button
          appearance="primary"
          onClick={() => onSelectFont(fontType, mode)}
          width="100%"
        >
          {buttonText}
        </Button>
      </Pane>
      
      <Pane>
        <Text size={300} color="muted" marginBottom={8} display="block">
          Mode:
        </Text>
        <Pane display="flex" gap={8}>
          <Button
            appearance={mode === 'curated' ? 'primary' : 'default'}
            onClick={() => onModeChange('curated')}
            flex={1}
          >
            Curated
          </Button>
          <Button
            appearance={mode === 'all' ? 'primary' : 'default'}
            onClick={() => onModeChange('all')}
            flex={1}
            disabled={!hasApiKey}
            title={!hasApiKey ? 'Browse All mode requires Google Fonts API key' : ''}
          >
            Browse All
          </Button>
        </Pane>
        {!hasApiKey && (
          <Text size={300} color="muted" marginTop={8} display="block">
            API key required for Browse All mode
          </Text>
        )}
      </Pane>
    </Pane>
  );
}

