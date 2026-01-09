

import { REQUIRED_CSV_HEADERS } from '../constants/app.constants';
import type { RawBOMRow } from './bom.types';

/**
 * Type guard to check if a value is a valid number string
 */
export const isValidNumberString = (value: string): boolean => {
  if (!value || value.trim() === '') return false;
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num) && num >= 0;
};

/**
 * Type guard to check if headers match required format
 */
export const hasValidHeaders = (headers: string[]): boolean => {
  if (headers.length !== REQUIRED_CSV_HEADERS.length) return false;
  
  return REQUIRED_CSV_HEADERS.every((requiredHeader, index) => {
    return headers[index]?.trim() === requiredHeader;
  });
};

/**
 * Type guard for RawBOMRow
 */
export const isRawBOMRow = (row: any): row is RawBOMRow => {
  return (
    typeof row === 'object' &&
    row !== null &&
    'Item Code' in row &&
    'Material' in row &&
    'Quantity' in row &&
    'Estimated Rate' in row &&
    'Supplier 1 (Rate)' in row &&
    'Supplier 2 (Rate)' in row &&
    'Supplier 3 (Rate)' in row &&
    'Supplier 4 (Rate)' in row &&
    'Supplier 5 (Rate)' in row
  );
};

/**
 * Validate a single BOM row
 */
export const validateBOMRow = (row: RawBOMRow): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check Item Code
  if (!row['Item Code'] || row['Item Code'].trim() === '') {
    errors.push('Item Code is required');
  }

  // Check Material
  if (!row['Material'] || row['Material'].trim() === '') {
    errors.push('Material is required');
  }

  // Check Quantity
  if (!isValidNumberString(row['Quantity'])) {
    errors.push('Quantity must be a valid number');
  }

  // Check Estimated Rate
  if (!isValidNumberString(row['Estimated Rate'])) {
    errors.push('Estimated Rate must be a valid number');
  }

  // Supplier rates can be empty (null values allowed)

  return {
    isValid: errors.length === 0,
    errors,
  };
};