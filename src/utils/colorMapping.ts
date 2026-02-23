/**
 * Color Mapping Utilities for Keyboard Heatmap
 * Implements logarithmic scaling and color interpolation
 */

/**
 * 11-color gradient scheme (white to dark red)
 * Based on reference implementation
 */
export const colorScheme = [
  '#ffffff', // 0 - White
  '#ffffcc', // 1 - Very light yellow
  '#ffefa5', // 2 - Light yellow
  '#fede80', // 3 - Yellow
  '#febf5a', // 4 - Light orange
  '#fd9e43', // 5 - Orange
  '#fd7034', // 6 - Dark orange
  '#f43d25', // 7 - Red-orange
  '#da141e', // 8 - Red
  '#b60026', // 9 - Dark red
  '#800026', // 10 - Very dark red
];

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

/**
 * Convert RGB to hex color
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Interpolate between two colors
 * @param color1 First color (hex)
 * @param color2 Second color (hex)
 * @param factor Interpolation factor (0-1)
 */
export function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const r = c1.r + (c2.r - c1.r) * factor;
  const g = c1.g + (c2.g - c1.g) * factor;
  const b = c1.b + (c2.b - c1.b) * factor;

  return rgbToHex(r, g, b);
}

/**
 * Get color for a key based on its usage count
 * Uses logarithmic scaling to handle wide range of values
 *
 * @param count Usage count for the key
 * @param maxCount Maximum usage count across all keys
 * @returns Hex color string
 */
export function getKeyColor(count: number, maxCount: number): string {
  // Handle edge cases
  if (count === 0 || maxCount === 0) {
    return colorScheme[0]; // White for no usage
  }

  if (count === maxCount) {
    return colorScheme[10]; // Darkest red for max usage
  }

  // Logarithmic scaling
  const rate = Math.log(count) / Math.log(maxCount);

  // Map to color index (0-10)
  const index = Math.floor(rate * 10);
  const factor = (rate * 10) - index;

  // Ensure index is within bounds
  const safeIndex = Math.max(0, Math.min(9, index));

  // Interpolate between adjacent colors
  return interpolateColor(
    colorScheme[safeIndex],
    colorScheme[safeIndex + 1],
    factor
  );
}

/**
 * Get color scale legend data
 * Returns array of color stops with labels
 */
export function getColorScaleLegend(maxCount: number): Array<{ color: string; label: string; value: number }> {
  const stops = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

  return stops.map((stop, index) => {
    const value = Math.round(Math.pow(maxCount, stop));
    return {
      color: colorScheme[index],
      label: value.toLocaleString(),
      value,
    };
  });
}

/**
 * Get text color (black or white) based on background color
 * Ensures good contrast for readability
 */
export function getTextColor(backgroundColor: string): string {
  const rgb = hexToRgb(backgroundColor);
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? '#333333' : '#ffffff';
}
