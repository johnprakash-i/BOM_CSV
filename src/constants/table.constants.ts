
import { SUPPLIER_COUNT } from './app.constants';
import type { TableColumn } from '../types/bom.types';

/**
 * Static column definitions for the BOM table
 * These columns are always present and not supplier-specific
 */
export const STATIC_COLUMNS: TableColumn[] = [
  {
    id: 'itemCode',
    label: 'Item Code',
    key: 'itemCode',
    sortable: true,
    freezable: true,
    hideable: false, // Item code should always be visible
    width: 'w-32',
    align: 'left',
  },
  {
    id: 'material',
    label: 'Material',
    key: 'material',
    sortable: true,
    freezable: true,
    hideable: false, // Material should always be visible
    width: 'w-64',
    align: 'left',
  },
  {
    id: 'quantity',
    label: 'Quantity',
    key: 'quantity',
    sortable: true,
    freezable: true,
    hideable: true,
    width: 'w-28',
    align: 'right',
  },
  {
    id: 'estimatedRate',
    label: 'Estimated Rate',
    key: 'estimatedRate',
    sortable: true,
    freezable: true,
    hideable: true,
    width: 'w-36',
    align: 'right',
  },
];

/**
 * Generate supplier column definitions dynamically
 * These are the columns that will have heatmap coloring
 */
export const generateSupplierColumns = (): TableColumn[] => {
  return Array.from({ length: SUPPLIER_COUNT }, (_, index) => ({
    id: `supplier${index + 1}`,
    label: `Supplier ${index + 1}`,
    key: 'supplier' as const, // Special key indicating this is a supplier column
    sortable: true,
    freezable: true,
    hideable: true,
    width: 'w-40',
    align: 'right' as const,
  }));
};

/**
 * Get all table columns (static + supplier columns)
 */
export const getAllColumns = (): TableColumn[] => {
  return [...STATIC_COLUMNS, ...generateSupplierColumns()];
};

/**
 * Column groups for better organization
 */
export const COLUMN_GROUPS = {
  BASIC_INFO: ['itemCode', 'material', 'quantity'],
  PRICING: ['estimatedRate'],
  SUPPLIERS: Array.from({ length: SUPPLIER_COUNT }, (_, i) => `supplier${i + 1}`),
} as const;