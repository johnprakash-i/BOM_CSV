/**
 * Core BOM (Bill of Materials) Type Definitions
 * These types ensure type safety across the application
 */

/**
 * Raw CSV row as parsed from the file
 * Maps directly to CSV columns
 */
export interface RawBOMRow {
  'Item Code': string;
  'Material': string;
  'Quantity': string;
  'Estimated Rate': string;
  'Supplier 1 (Rate)': string;
  'Supplier 2 (Rate)': string;
  'Supplier 3 (Rate)': string;
  'Supplier 4 (Rate)': string;
  'Supplier 5 (Rate)': string;
}

/**
 * Supplier rate with metadata for heatmap calculation
 */
export interface SupplierRate {
  supplierId: string;
  rate: number | null;
  percentageDiff: number | null; // Difference from estimated rate
  heatmapColor: string; // Computed color based on min/max in row
}

/**
 * Processed BOM item with calculated values
 * This is the normalized structure used throughout the app
 */
export interface BOMItem {
  id: string; // Unique identifier (generated)
  itemCode: string;
  material: string;
  quantity: number;
  estimatedRate: number;
  supplierRates: SupplierRate[];
  minRate: number | null; // Minimum rate across all suppliers
  maxRate: number | null; // Maximum rate across all suppliers
}

/**
 * Table column definition
 */
export interface TableColumn {
  id: string;
  label: string;
  key: keyof BOMItem | 'supplier'; // Matches BOMItem keys or special 'supplier' for dynamic columns
  sortable: boolean;
  freezable: boolean;
  hideable: boolean;
  width?: string; // Tailwind width class or custom
  align?: 'left' | 'center' | 'right';
}

/**
 * Sort configuration
 */
export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
  columnId: string | null;
  direction: SortDirection;
}

/**
 * Column visibility state
 */
export interface ColumnVisibility {
  [columnId: string]: boolean;
}

/**
 * Table state management
 */
export interface TableState {
  data: BOMItem[];
  sortConfig: SortConfig;
  frozenColumnIndex: number; // Index of the last frozen column (-1 = none)
  columnVisibility: ColumnVisibility;
  isLoading: boolean;
}

/**
 * CSV validation result
 */
export interface CSVValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  rowCount: number;
}

/**
 * File upload state
 */
export interface FileUploadState {
  file: File | null;
  isValidating: boolean;
  isProcessing: boolean;
  validationResult: CSVValidationResult | null;
  error: string | null;
}