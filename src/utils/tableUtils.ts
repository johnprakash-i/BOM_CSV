import type { BOMItem, SortConfig, TableColumn } from "../types/bom.types";
import { getAllColumns } from "../constants/table.constants";


/**
 * Sort BOM items based on sort configuration
 */
export const sortBOMItems = (
  items: BOMItem[],
  sortConfig: SortConfig
): BOMItem[] => {
  if (!sortConfig.columnId || !sortConfig.direction) {
    return items;
  }

  const columns = getAllColumns();
  const column = columns.find(col => col.id === sortConfig.columnId);
  
  if (!column) return items;

  const sortedItems = [...items].sort((a, b) => {
    let valueA: any;
    let valueB: any;

    if (column.key === 'supplier') {
      // Handle supplier columns (use index from column id)
      const supplierIndex = parseInt(column.id.replace('supplier', '')) - 1;
      valueA = a.supplierRates[supplierIndex]?.rate;
      valueB = b.supplierRates[supplierIndex]?.rate;
    } else {
      // Handle regular columns
      valueA = a[column.key];
      valueB = b[column.key];
    }

    // Handle null/undefined values
    if (valueA == null && valueB == null) return 0;
    if (valueA == null) return 1;
    if (valueB == null) return -1;

    // Numeric comparison
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return valueA - valueB;
    }

    // String comparison
    return String(valueA).localeCompare(String(valueB));
  });

  return sortConfig.direction === 'asc' ? sortedItems : sortedItems.reverse();
};

/**
 * Filter visible columns based on visibility state
 */
export const getVisibleColumns = (
  columns: TableColumn[],
  columnVisibility: { [key: string]: boolean }
): TableColumn[] => {
  return columns.filter(column => 
    !column.hideable || columnVisibility[column.id] !== false
  );
};

/**
 * Get CSS classes for frozen columns
 */
export const getFrozenColumnClasses = (
  columnIndex: number,
  frozenColumnIndex: number
): string => {
  if (frozenColumnIndex === -1 || columnIndex > frozenColumnIndex) {
    return '';
  }

  const position = columnIndex === frozenColumnIndex ? 'border-r-2 border-blue-300' : '';
  
  return `
    sticky left-0 z-10 bg-white shadow-right
    ${columnIndex === 0 ? 'left-0' : ''}
    ${columnIndex === 1 ? 'left-[var(--col-0-width)]' : ''}
    ${columnIndex === 2 ? 'left-[calc(var(--col-0-width)+var(--col-1-width))]' : ''}
    ${position}
  `.trim();
};

/**
 * Calculate column widths for dynamic positioning
 */
export const calculateColumnWidths = (columns: TableColumn[]): string[] => {
  return columns.map(col => {
    if (col.width && col.width.startsWith('w-')) {
      return col.width;
    }
    return 'w-auto';
  });
};

/**
 * Format number with commas and fixed decimals
 */
export const formatNumber = (value: number | null, decimals: number = 2): string => {
  if (value === null || isNaN(value)) return '-';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format percentage difference
 */
export const formatPercentageDiff = (value: number | null): string => {
  if (value === null || isNaN(value)) return '-';
  
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

/**
 * Get accessibility text for color-coded cells
 */
export const getHeatmapAccessibilityText = (
  value: number | null,
  min: number | null,
  max: number | null,
  estimatedRate: number
): string => {
  if (value === null) return 'No rate provided';
  
  let position = '';
  if (value === min) position = ' (lowest rate)';
  if (value === max) position = ' (highest rate)';
  
  const diff = estimatedRate > 0 ? ((value - estimatedRate) / estimatedRate) * 100 : 0;
  const diffText = diff !== 0 ? `, ${diff >= 0 ? '+' : ''}${diff.toFixed(1)}% from estimated` : '';
  
  return `Rate: ${value.toFixed(2)}${position}${diffText}`;
};