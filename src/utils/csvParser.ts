
import { ERROR_MESSAGES, SUPPLIER_COLUMNS } from '../constants/app.constants';
import type { BOMItem, CSVValidationResult, RawBOMRow, SupplierRate } from '../types/bom.types';
import { hasValidHeaders, validateBOMRow, isValidNumberString } from '../types/validators';
import { v4 as uuidv4 } from 'uuid';

/**
 * Parse CSV file content into RawBOMRow array
 */
export const parseCSVContent = async (file: File): Promise<{ data: RawBOMRow[]; errors: string[] }> => {
  const errors: string[] = [];

  try {
    const text = await file.text();
    const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
    
    if (lines.length < 2) {
      throw new Error(ERROR_MESSAGES.EMPTY_FILE);
    }

    // Parse headers
    const headers = lines[0].split(',').map(header => header.trim());
    
    // Validate headers
    if (!hasValidHeaders(headers)) {
      throw new Error(ERROR_MESSAGES.INVALID_HEADERS);
    }

    // Parse data rows
    const data: RawBOMRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      const values = line.split(',').map(value => value.trim());
      
      // Handle quoted values with commas
      const reconstructedValues: string[] = [];
      let currentValue = '';
      let inQuotes = false;

      for (const value of values) {
        if (value.startsWith('"') && !value.endsWith('"')) {
          inQuotes = true;
          currentValue = value.slice(1);
        } else if (value.endsWith('"') && inQuotes) {
          inQuotes = false;
          currentValue += ',' + value.slice(0, -1);
          reconstructedValues.push(currentValue);
          currentValue = '';
        } else if (inQuotes) {
          currentValue += ',' + value;
        } else {
          reconstructedValues.push(value);
        }
      }

      // Create raw row
      const rawRow: RawBOMRow = {
        'Item Code': reconstructedValues[0] || '',
        'Material': reconstructedValues[1] || '',
        'Quantity': reconstructedValues[2] || '',
        'Estimated Rate': reconstructedValues[3] || '',
        'Supplier 1 (Rate)': reconstructedValues[4] || '',
        'Supplier 2 (Rate)': reconstructedValues[5] || '',
        'Supplier 3 (Rate)': reconstructedValues[6] || '',
        'Supplier 4 (Rate)': reconstructedValues[7] || '',
        'Supplier 5 (Rate)': reconstructedValues[8] || '',
      };

      data.push(rawRow);
    }

    return { data, errors };
  } catch (error) {
    if (error instanceof Error) {
      errors.push(error.message);
    } else {
      errors.push(ERROR_MESSAGES.PARSE_ERROR);
    }
    return { data: [], errors };
  }
};

/**
 * Validate CSV data comprehensively
 */
export const validateCSVData = (rawData: RawBOMRow[]): CSVValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (rawData.length === 0) {
    errors.push(ERROR_MESSAGES.NO_DATA_ROWS);
    return { isValid: false, errors, warnings, rowCount: 0 };
  }

  let rowNum = 1;
  for (const row of rawData) {
    const validation = validateBOMRow(row);
    if (!validation.isValid) {
      errors.push(`Row ${rowNum}: ${validation.errors.join(', ')}`);
    }
    rowNum++;
  }

  // Check for duplicate item codes
  const itemCodes = rawData.map(row => row['Item Code'].trim());
  const duplicates = itemCodes.filter((code, index) => itemCodes.indexOf(code) !== index);
  if (duplicates.length > 0) {
    warnings.push(`Found duplicate item codes: ${[...new Set(duplicates)].join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    rowCount: rawData.length,
  };
};

/**
 * Convert raw CSV data to processed BOM items with calculations
 */
export const processBOMData = (rawData: RawBOMRow[]): BOMItem[] => {
  return rawData.map((rawRow:any) => {
    // Parse numeric values
    const quantity = parseFloat(rawRow['Quantity']) || 0;
    const estimatedRate = parseFloat(rawRow['Estimated Rate']) || 0;

    // Parse supplier rates
    const supplierRates: SupplierRate[] = SUPPLIER_COLUMNS.map((supplierCol, index) => {
      const rateStr = rawRow[supplierCol];
      const rate = isValidNumberString(rateStr) ? parseFloat(rateStr) : null;
      
      // Calculate percentage difference from estimated rate
      let percentageDiff = null;
      if (rate !== null && estimatedRate > 0) {
        percentageDiff = ((rate - estimatedRate) / estimatedRate) * 100;
      }

      return {
        supplierId: `supplier${index + 1}`,
        rate,
        percentageDiff,
        heatmapColor: '', // Will be calculated later per row
      };
    });

    // Filter out null rates for min/max calculations
    const validRates = supplierRates
      .map(sr => sr.rate)
      .filter((rate): rate is number => rate !== null);

    const minRate = validRates.length > 0 ? Math.min(...validRates) : null;
    const maxRate = validRates.length > 0 ? Math.max(...validRates) : null;

    // Apply heatmap colors
    const processedSupplierRates = supplierRates.map(sr => ({
      ...sr,
      heatmapColor: calculateHeatmapColor(sr.rate, minRate, maxRate),
    }));

    return {
      id: uuidv4(),
      itemCode: rawRow['Item Code'].trim(),
      material: rawRow['Material'].trim(),
      quantity,
      estimatedRate,
      supplierRates: processedSupplierRates,
      minRate,
      maxRate,
    };
  });
};

/**
 * Calculate heatmap color based on value position between min and max
 */
export const calculateHeatmapColor = (
  value: number | null,
  min: number | null,
  max: number | null
): string => {
  if (value === null || min === null || max === null || min === max) {
    return 'rgb(243, 244, 246)'; // Neutral color for null or equal values
  }

  // Normalize value between 0 (min) and 1 (max)
  const normalized = (value - min) / (max - min);

  // Interpolate between green (0), yellow (0.5), and red (1)
  let r, g, b;
  
  if (normalized <= 0.5) {
    // Green to Yellow
    const factor = normalized * 2;
    r = Math.round(34 + (234 - 34) * factor);
    g = Math.round(197 + (179 - 197) * factor);
    b = Math.round(94 + (8 - 94) * factor);
  } else {
    // Yellow to Red
    const factor = (normalized - 0.5) * 2;
    r = Math.round(234 + (239 - 234) * factor);
    g = Math.round(179 + (68 - 179) * factor);
    b = Math.round(8 + (68 - 8) * factor);
  }

  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Parse CSV file and return processed BOM data
 */
export const parseAndProcessCSV = async (
  file: File
): Promise<{ data: BOMItem[]; validation: CSVValidationResult; rawCount: number }> => {
  try {
    // Step 1: Parse CSV content
    const { data: rawData, errors: parseErrors } = await parseCSVContent(file);
    
    if (parseErrors.length > 0) {
      return {
        data: [],
        validation: {
          isValid: false,
          errors: parseErrors,
          warnings: [],
          rowCount: 0,
        },
        rawCount: 0,
      };
    }

    // Step 2: Validate data
    const validation = validateCSVData(rawData);
    
    // Step 3: Process data (even if validation fails for warnings)
    const processedData = processBOMData(rawData);

    return {
      data: validation.isValid ? processedData : [],
      validation,
      rawCount: rawData.length,
    };
  } catch (error) {
    return {
      data: [],
      validation: {
        isValid: false,
        errors: [ERROR_MESSAGES.PARSE_ERROR],
        warnings: [],
        rowCount: 0,
      },
      rawCount: 0,
    };
  }
};