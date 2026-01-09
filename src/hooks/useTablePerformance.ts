import { useMemo, useCallback } from 'react';
import type { BOMItem } from '../types/bom.types';


/**
 * Custom hook for table performance optimizations
 */
export const useTablePerformance = (data: BOMItem[]) => {
  // Memoized calculation of column statistics
  const columnStats = useMemo(() => {
    if (data.length === 0) {
      return {
        estimatedRate: { min: 0, max: 0, avg: 0 },
        suppliers: Array.from({ length: 5 }, () => ({ min: 0, max: 0, avg: 0 })),
      };
    }

    // Calculate stats for estimated rate
    const estimatedRates = data.map(item => item.estimatedRate);
    const estimatedRateStats = {
      min: Math.min(...estimatedRates),
      max: Math.max(...estimatedRates),
      avg: estimatedRates.reduce((a, b) => a + b, 0) / estimatedRates.length,
    };

    // Calculate stats for each supplier
    const supplierStats = Array.from({ length: 5 }, (_, supplierIndex) => {
      const rates = data
        .map(item => item.supplierRates[supplierIndex]?.rate)
        .filter((rate): rate is number => rate !== null);

      if (rates.length === 0) {
        return { min: 0, max: 0, avg: 0 };
      }

      return {
        min: Math.min(...rates),
        max: Math.max(...rates),
        avg: rates.reduce((a, b) => a + b, 0) / rates.length,
      };
    });

    return {
      estimatedRate: estimatedRateStats,
      suppliers: supplierStats,
    };
  }, [data]);

  // Memoized supplier rate getter
  const getSupplierRate = useCallback((item: BOMItem, supplierIndex: number) => {
    return item.supplierRates[supplierIndex] || null;
  }, []);

  // Debounced function (for future filter implementation)
  const debounce = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  return {
    columnStats,
    getSupplierRate,
    debounce,
  };
};