import { useMemo } from 'react';

import { HEATMAP_COLORS } from '../constants/app.constants';
import { calculateHeatmapColor } from '../utils';


/**
 * Custom hook for color-related utilities
 */
export const useColorUtils = () => {
  // Calculate text color based on background for accessibility
  const getContrastColor = useMemo(() => (backgroundColor: string): string => {
    // Extract RGB values from string
    const match = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return '#000000'; // Default to black

    const [, r, g, b] = match.map(Number);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black or white based on luminance
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }, []);

  // Generate gradient for heatmap legend
  const generateHeatmapGradient = useMemo(() => (steps: number = 5): string[] => {
    const gradient: string[] = [];
    
    for (let i = 0; i < steps; i++) {
      const normalized = i / (steps - 1);
      
      if (normalized <= 0.5) {
        // Green to Yellow
        const factor = normalized * 2;
        const r = Math.round(HEATMAP_COLORS.MIN.r + (HEATMAP_COLORS.MID.r - HEATMAP_COLORS.MIN.r) * factor);
        const g = Math.round(HEATMAP_COLORS.MIN.g + (HEATMAP_COLORS.MID.g - HEATMAP_COLORS.MIN.g) * factor);
        const b = Math.round(HEATMAP_COLORS.MIN.b + (HEATMAP_COLORS.MID.b - HEATMAP_COLORS.MIN.b) * factor);
        gradient.push(`rgb(${r}, ${g}, ${b})`);
      } else {
        // Yellow to Red
        const factor = (normalized - 0.5) * 2;
        const r = Math.round(HEATMAP_COLORS.MID.r + (HEATMAP_COLORS.MAX.r - HEATMAP_COLORS.MID.r) * factor);
        const g = Math.round(HEATMAP_COLORS.MID.g + (HEATMAP_COLORS.MAX.g - HEATMAP_COLORS.MID.g) * factor);
        const b = Math.round(HEATMAP_COLORS.MID.b + (HEATMAP_COLORS.MAX.b - HEATMAP_COLORS.MID.b) * factor);
        gradient.push(`rgb(${r}, ${g}, ${b})`);
      }
    }
    
    return gradient;
  }, []);

  // Calculate heatmap color with memoization
  const memoizedHeatmapColor = useMemo(() => {
    const cache = new Map<string, string>();
    
    return (value: number | null, min: number | null, max: number | null): string => {
      const cacheKey = `${value}_${min}_${max}`;
      
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey)!;
      }
      
      const color = calculateHeatmapColor(value, min, max);
      cache.set(cacheKey, color);
      
      return color;
    };
  }, []);

  return {
    getContrastColor,
    generateHeatmapGradient,
    calculateHeatmapColor: memoizedHeatmapColor,
  };
};