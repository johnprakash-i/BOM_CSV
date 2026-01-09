import { useState, useCallback } from 'react';
import type { BOMItem, CSVValidationResult } from '../types/bom.types';
import { CSV_CONFIG, ERROR_MESSAGES } from '../constants/app.constants';
import { parseAndProcessCSV } from '../utils';




interface UseCSVUploadReturn {
  isUploading: boolean;
  isValidating: boolean;
  validationResult: CSVValidationResult | null;
  uploadProgress: number;
  uploadError: string | null;
  uploadFile: (file: File) => Promise<BOMItem[] | null>;
  resetUpload: () => void;
}

/**
 * Custom hook for handling CSV file upload with validation
 */
export const useCSVUpload = (): UseCSVUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<CSVValidationResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Validate file before upload
  const validateFile = useCallback((file: File): { isValid: boolean; error?: string } => {
    // Check file size
    if (file.size > CSV_CONFIG.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.FILE_TOO_LARGE,
      };
    }

    // Check file type
   const fileExtension = (
  '.' + file.name.split('.').pop()?.toLowerCase()
) as (typeof CSV_CONFIG.ALLOWED_EXTENSIONS)[number];
   const isValidType =
  CSV_CONFIG.ALLOWED_MIME_TYPES.includes(
    file.type as (typeof CSV_CONFIG.ALLOWED_MIME_TYPES)[number]
  ) ||
  CSV_CONFIG.ALLOWED_EXTENSIONS.includes(fileExtension);

    if (!isValidType) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.INVALID_FILE_TYPE,
      };
    }

    return { isValid: true };
  }, []);

  // Upload and process CSV file
// Upload and process CSV file
const uploadFile = useCallback(
  async (file: File): Promise<BOMItem[] | null> => {
    // Reset states
    setUploadError(null);
    setValidationResult(null);
    setIsValidating(true);
    setUploadProgress(0);

    try {
      const fileValidation = validateFile(file);
      if (!fileValidation.isValid) throw new Error(fileValidation.error);

      setUploadProgress(10);
      setIsValidating(false);
      setIsUploading(true);

      const result = await parseAndProcessCSV(file);
      setUploadProgress(70);

      setValidationResult(result.validation);
      setUploadProgress(90);

      if (!result.validation.isValid) throw new Error('CSV validation failed');

      setUploadProgress(100);
      setIsUploading(false);

      // ✅ Return only data
      return result.data;
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      setIsUploading(false);
      setIsValidating(false);
      return null;
    }
  },
  [validateFile]
);



  // Reset upload state
  const resetUpload = useCallback(() => {
    setIsUploading(false);
    setIsValidating(false);
    setValidationResult(null);
    setUploadProgress(0);
    setUploadError(null);
  }, []);

  return {
    isUploading,
    isValidating,
    validationResult,
    uploadProgress,
    uploadError,
    uploadFile,
    resetUpload,
  };
};