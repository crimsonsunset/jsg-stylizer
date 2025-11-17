/**
 * ThemePreview - Display current font selections with live preview
 * Shows actual fonts in use with preview text
 */

import { Pane, Text, Heading } from 'evergreen-ui';
import type { InternalConfig } from '../config';
import type { FontInfo } from '../types';

interface ThemePreviewProps {
  config: InternalConfig;
  fonts: Record<string, FontInfo>;
}

/**
 * Theme preview component displaying font selections with live preview
 */
export function ThemePreview({ config, fonts }: ThemePreviewProps) {
  const previewText = config.previewText || 'The quick brown fox jumps over the lazy dog';

  return (
    <Pane paddingX={16} paddingY={24} borderTop="muted">
      <Heading size={500} marginBottom={16} color="#FFFFFF">
        Theme Preview
      </Heading>
      <Pane display="flex" flexDirection="column" gap={16}>
        {config.fonts.map((fontConfig) => {
          const fontInfo = fonts[fontConfig.id];
          if (!fontInfo) return null;
          
          const fontFamily = `"${fontInfo.family}", sans-serif`;
          
          return (
            <Pane key={fontConfig.id} display="flex" flexDirection="column" gap={8}>
              <Text 
                size={400} 
                color="muted" 
                fontWeight={500}
                style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {fontConfig.label}: {fontInfo.family} | {fontInfo.weight}{fontInfo.italic ? ' italic' : ''}
              </Text>
              <Pane
                padding={12}
                backgroundColor="rgba(255, 255, 255, 0.05)"
                borderRadius={4}
                style={{
                  fontFamily: fontFamily,
                  fontWeight: fontInfo.weight,
                  fontStyle: fontInfo.italic ? 'italic' : 'normal',
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
          );
        })}
      </Pane>
    </Pane>
  );
}

