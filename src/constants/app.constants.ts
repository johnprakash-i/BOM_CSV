/**
 * Application-wide constants
 * Centralized configuration for easy maintenance
 */

/**
 * CSV File Upload Configuration
 */
export const CSV_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  ALLOWED_MIME_TYPES: ['text/csv', 'application/vnd.ms-excel', 'text/plain'],
  ALLOWED_EXTENSIONS: ['.csv'],
} as const;

/**
 * Required CSV headers in exact order
 * Used for validation and parsing
 */
export const REQUIRED_CSV_HEADERS = [
  'Item Code',
  'Material',
  'Quantity',
  'Estimated Rate',
  'Supplier 1 (Rate)',
  'Supplier 2 (Rate)',
  'Supplier 3 (Rate)',
  'Supplier 4 (Rate)',
  'Supplier 5 (Rate)',
] as const;

/**
 * Number of supplier columns
 */
export const SUPPLIER_COUNT = 5;

/**
 * Generate supplier column keys dynamically
 */
export const SUPPLIER_COLUMNS = Array.from(
  { length: SUPPLIER_COUNT },
  (_, i) => `Supplier ${i + 1} (Rate)`
);

/**
 * Heatmap color configuration
 * Colors transition from green (min) to yellow (mid) to red (max)
 */
export const HEATMAP_COLORS = {
  MIN: { r: 34, g: 197, b: 94 },   // green-500
  MID: { r: 234, g: 179, b: 8 },   // yellow-500
  MAX: { r: 239, g: 68, b: 68 },   // red-500
  NEUTRAL: { r: 243, g: 244, b: 246 }, // gray-100 (for null values)
} as const;

/**
 * Table configuration
 */
export const TABLE_CONFIG = {
  DEFAULT_FROZEN_COLUMNS: -1, // No columns frozen by default
  MIN_COLUMN_WIDTH: 120, // Minimum column width in pixels
  STICKY_HEADER_HEIGHT: 64, // Height of sticky header in pixels
} as const;

/**
 * Routes
 */
export const ROUTES = {
  HOME: '/',
  UPLOAD: '/',
  TABLE: '/table',
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  TABLE_STATE: 'bom_table_state',
  COLUMN_VISIBILITY: 'bom_column_visibility',
  FROZEN_COLUMN: 'bom_frozen_column',
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: `File size exceeds ${CSV_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB limit`,
  INVALID_FILE_TYPE: 'Please upload a valid CSV file',
  INVALID_HEADERS: 'CSV file has incorrect headers. Please check the required format.',
  EMPTY_FILE: 'CSV file is empty',
  PARSE_ERROR: 'Failed to parse CSV file. Please check the file format.',
  NO_DATA_ROWS: 'CSV file contains no data rows',
  INVALID_NUMERIC_VALUE: 'Some numeric values in the CSV are invalid',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  FILE_VALIDATED: 'File validated successfully',
  DATA_LOADED: 'Data loaded successfully',
} as const;

/**
 * UI text constants
 */
export const UI_TEXT = {
  APP_TITLE: 'Bill of Materials Comparison Tool',
  APP_DESCRIPTION: 'Compare supplier rates with visual heatmaps and advanced analysis',
  UPLOAD_TITLE: 'Upload CSV File',
  UPLOAD_DESCRIPTION: 'Upload your Bill of Materials CSV file to begin analysis',
  DRAG_DROP_TEXT: 'Drag and drop your CSV file here, or click to browse',
  FILE_REQUIREMENTS: 'Maximum file size: 10MB. Only CSV files are accepted.',
  PROCESSING: 'Processing your file...',
  LOADING: 'Loading...',
} as const;