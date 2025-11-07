/**
 * ThemePreview - Display current font selections with live preview
 * Shows actual fonts in use with preview text
 */

import { Pane, Text, Heading } from 'evergreen-ui';
import type { InternalConfig } from '../config';
import type { FontInfo } from '../types';

interface ThemePreviewProps {
  config: InternalConfig;
  fonts: {
    primary: FontInfo;
    secondary: FontInfo;
  };
}

/**
 * Theme preview component displaying font selections with live preview
 */
export function ThemePreview({ config, fonts }: ThemePreviewProps) {
  const previewText = config.previewText || 'The quick brown fox jumps over the lazy dog';

  // Build CSS font-family strings
  const primaryFontFamily = `"${fonts.primary.family}", sans-serif`;
  const secondaryFontFamily = `"${fonts.secondary.family}", sans-serif`;

  return (
    <Pane paddingX={16} paddingY={24} borderTop="muted">
      <Heading size={500} marginBottom={16} color="#FFFFFF">
        Theme Preview
      </Heading>
      <Pane display="flex" flexDirection="column" gap={16}>
        {/* Primary Font Preview */}
        <Pane display="flex" flexDirection="column" gap={8}>
          <Text size={400} color="muted" fontWeight={500}>
            Primary: {fonts.primary.family} | {fonts.primary.weight}{fonts.primary.italic ? ' italic' : ''}
          </Text>
          <Pane
            padding={12}
            backgroundColor="rgba(255, 255, 255, 0.05)"
            borderRadius={4}
            style={{
              fontFamily: primaryFontFamily,
              fontWeight: fonts.primary.weight,
              fontStyle: fonts.primary.italic ? 'italic' : 'normal',
              fontSize: '13px',
              lineHeight: '1.4',
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {previewText}
          </Pane>
        </Pane>

        {/* Secondary Font Preview */}
        <Pane display="flex" flexDirection="column" gap={8}>
          <Text size={400} color="muted" fontWeight={500}>
            Secondary: {fonts.secondary.family} | {fonts.secondary.weight}{fonts.secondary.italic ? ' italic' : ''}
          </Text>
          <Pane
            padding={12}
            backgroundColor="rgba(255, 255, 255, 0.05)"
            borderRadius={4}
            style={{
              fontFamily: secondaryFontFamily,
              fontWeight: fonts.secondary.weight,
              fontStyle: fonts.secondary.italic ? 'italic' : 'normal',
              fontSize: '13px',
              lineHeight: '1.4',
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {previewText}
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
}

