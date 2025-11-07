/**
 * ThemePreview - Display current CSS variable values
 * Read-only preview section showing theme configuration
 */

import { Pane, Text, Heading } from 'evergreen-ui';
import type { InternalConfig } from '../config';

interface ThemePreviewProps {
  config: InternalConfig;
}

/**
 * Theme preview component displaying CSS variable values
 */
export function ThemePreview({ config }: ThemePreviewProps) {
  const getCSSVariableValue = (variableName: string): string => {
    if (typeof document === 'undefined') return 'N/A';
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
    return value || 'Not set';
  };

  return (
    <Pane padding={16} borderTop="muted">
      <Heading size={400} marginBottom={12}>
        Theme Preview
      </Heading>
      <Pane display="flex" flexDirection="column" gap={8}>
        <Pane display="flex" justifyContent="space-between">
          <Text size={300} color="muted">
            Primary Font:
          </Text>
          <Text size={300} fontFamily={getCSSVariableValue(config.cssVariables.primary)}>
            {getCSSVariableValue(config.cssVariables.primary)}
          </Text>
        </Pane>
        <Pane display="flex" justifyContent="space-between">
          <Text size={300} color="muted">
            Secondary Font:
          </Text>
          <Text size={300} fontFamily={getCSSVariableValue(config.cssVariables.secondary)}>
            {getCSSVariableValue(config.cssVariables.secondary)}
          </Text>
        </Pane>
        {config.theme.background && (
          <Pane display="flex" justifyContent="space-between">
            <Text size={300} color="muted">
              Background:
            </Text>
            <Text size={300}>{getCSSVariableValue(config.theme.background)}</Text>
          </Pane>
        )}
        {config.theme.text && (
          <Pane display="flex" justifyContent="space-between">
            <Text size={300} color="muted">
              Text:
            </Text>
            <Text size={300}>{getCSSVariableValue(config.theme.text)}</Text>
          </Pane>
        )}
        {config.theme.accent && (
          <Pane display="flex" justifyContent="space-between">
            <Text size={300} color="muted">
              Accent:
            </Text>
            <Text size={300}>{getCSSVariableValue(config.theme.accent)}</Text>
          </Pane>
        )}
      </Pane>
    </Pane>
  );
}

