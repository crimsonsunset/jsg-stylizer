/**
 * FontDetails - Display font information in standardized format
 * Format: FontFamily | Weight | Numeric
 */

import { Text } from 'evergreen-ui';

interface FontDetailsProps {
  fontFamily: string;
  weight?: string;
  numeric?: number;
}

/**
 * Font details component displaying font info in FontFamily | Weight | Numeric format
 */
export function FontDetails({ fontFamily, weight, numeric }: FontDetailsProps) {
  const parts: string[] = [fontFamily];
  
  if (weight) {
    parts.push(weight);
  }
  
  if (numeric !== undefined) {
    parts.push(numeric.toString());
  }
  
  return (
    <Text size={400} color="muted">
      {parts.join(' | ')}
    </Text>
  );
}

