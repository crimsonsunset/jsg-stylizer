/**
 * ThemePreview - Display current font selections
 * Shows font name and weight in format: "Primary: NAME | WEIGHT"
 */

import { Pane, Text, Heading } from 'evergreen-ui';
import type { InternalConfig } from '../config';

interface ThemePreviewProps {
  config: InternalConfig;
}

/**
 * Extract font name from CSS variable value
 * Handles formats like: "FontName", sans-serif or "FontName"
 */
function extractFontName(cssValue: string): string {
  if (!cssValue || cssValue === 'Not set') return 'Not set';
  
  // Remove quotes and extract font name (before first comma)
  const match = cssValue.match(/^"?([^",]+)"?/);
  return match ? match[1].trim() : cssValue;
}

/**
 * Extract font weight from CSS variable (defaults to 400 if not found)
 * For now, we default to 400 as weight isn't stored separately
 */
function extractFontWeight(cssValue: string): string {
  // Weight isn't currently stored in CSS variable, default to 400
  // TODO: Store weight when font picker supports it
  return '400';
}

/**
 * Theme preview component displaying font selections
 */
export function ThemePreview({ config }: ThemePreviewProps) {
  const getCSSVariableValue = (variableName: string): string => {
    if (typeof document === 'undefined') return 'Not set';
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
    return value || 'Not set';
  };

  const primaryValue = getCSSVariableValue(config.cssVariables.primary);
  const secondaryValue = getCSSVariableValue(config.cssVariables.secondary);
  
  const primaryFont = extractFontName(primaryValue);
  const secondaryFont = extractFontName(secondaryValue);
  const primaryWeight = extractFontWeight(primaryValue);
  const secondaryWeight = extractFontWeight(secondaryValue);

  return (
    <Pane paddingX={16} paddingY={12} borderTop="muted">
      <Heading size={400} marginBottom={8} color="#FFFFFF">
        Theme Preview
      </Heading>
      <Pane display="flex" flexDirection="column" gap={6}>
        <Text size={300} color="muted">
          Primary: {primaryFont} | {primaryWeight}
        </Text>
        <Text size={300} color="muted">
          Secondary: {secondaryFont} | {secondaryWeight}
        </Text>
      </Pane>
    </Pane>
  );
}

