/**
 * FontDetails - Display font information in standardized format
 * Format: FontFamily | Weight | Numeric
 */

import { Text } from 'evergreen-ui';

interface FontDetailsProps {
  fontFamily: string;
  weight?: string; // Style: "normal" or "italic"
  numeric?: number; // Numeric weight: 100-900
}

/**
 * Font details component displaying font info in FontFamily | Weight | Numeric format
 * Example: "Roboto | normal | 400" or "Roboto | italic | 700"
 */
export function FontDetails({ fontFamily, weight, numeric }: FontDetailsProps) {
  const parts: string[] = [fontFamily];
  
  // Add numeric weight if available
  if (numeric !== undefined) {
    parts.push(numeric.toString());
  }
  
  // Add style (weight) if available and not "normal" (to avoid redundancy)
  if (weight && weight !== 'normal') {
    parts.push(weight);
  }
  
  return (
    <Text size={400} color="muted">
      {parts.join(' | ')}
    </Text>
  );
}

