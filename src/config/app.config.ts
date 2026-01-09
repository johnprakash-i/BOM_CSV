import type { DeepReadonly } from "../types/utility.types";


/**
 * Application configuration
 * This is the single source of truth for app-wide settings
 */
const appConfig = {
  /**
   * Application metadata
   */
  app: {
    name: 'BOM Comparison Tool',
    version: '1.0.0',
    description: 'Compare supplier rates with visual heatmaps',
  },

  /**
   * Feature flags
   */
  features: {
    enableColumnFreeze: true,
    enableColumnSort: true,
    enableColumnHide: true,
    enableHeatmap: true,
    enablePercentageDiff: true,
    enableLocalStorage: true, // Persist table state
    enableExport: false, // Future feature
    enableFilters: false, // Future feature
  },

  /**
   * Performance settings
   */
  performance: {
    enableVirtualScroll: false, // Enable for very large datasets
    virtualScrollThreshold: 1000, // Enable virtual scroll above this row count
    debounceDelay: 300, // Debounce delay for search/filter in ms
  },

  /**
   * UI settings
   */
  ui: {
    showLoadingSpinner: true,
    animationDuration: 200, // Animation duration in ms
    toastDuration: 3000, // Toast notification duration in ms
    compactMode: false, // Compact table view
  },

  /**
   * Validation settings
   */
  validation: {
    strictMode: true, // Strict validation of CSV data
    allowEmptySupplierRates: true, // Allow null supplier rates
    validateOnUpload: true,
  },

  /**
   * Developer settings
   */
  dev: {
    debug: import.meta.env.DEV,
    logErrors: true,
    showPerformanceMetrics: import.meta.env.DEV,
  },
} as const;

export type AppConfig = DeepReadonly<typeof appConfig>;
export default appConfig as AppConfig;