import React, { useCallback, useState } from "react";
import { FiUpload, FiFile, FiCheck, FiAlertCircle, FiX } from "react-icons/fi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/Card/Card";
import { Button } from "../../ui/Button/Button";
import { ProgressBar } from "../../ui/Loader/ProgressBar";
import { CSV_CONFIG, UI_TEXT } from "../../../constants/app.constants";

import { cn } from "../../../utils/classNames";
import type { CSVValidationResult } from "../../../types/bom.types";

export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  validationResult?: CSVValidationResult | null;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string | null;
  maxSize?: number;
  allowedTypes?: string[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  validationResult,
  isUploading = false,
  uploadProgress = 0,
  error = null,
  maxSize = CSV_CONFIG.MAX_FILE_SIZE,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  }, []);

  const handleFileSelection = (file: File) => {
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const clearSelection = () => {
    setSelectedFile(null);
  };

  const getFileIcon = () => {
    if (validationResult?.isValid)
      return <FiCheck className="text-green-500" />;
    if (error) return <FiAlertCircle className="text-red-500" />;
    return <FiFile className="text-blue-500" />;
  };

  const getStatusText = () => {
    if (isUploading) return "Processing...";
    if (error) return "Error uploading file";
    if (validationResult?.isValid) return "File ready to view";
    if (selectedFile) return "File selected";
    return "No file selected";
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{UI_TEXT.UPLOAD_TITLE}</CardTitle>
        <CardDescription>{UI_TEXT.UPLOAD_DESCRIPTION}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50",
            selectedFile && "border-blue-400 bg-blue-50/50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <FiUpload className="h-12 w-12 text-gray-400" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-700">
                {UI_TEXT.DRAG_DROP_TEXT}
              </p>
              <p className="text-sm text-gray-500">
                {UI_TEXT.FILE_REQUIREMENTS}
              </p>
              <p className="text-xs text-gray-400">
                Max file size: {formatFileSize(maxSize)}
              </p>
            </div>
            <Button
              variant="outline"
              leftIcon={<FiUpload />}
              onClick={() => document.getElementById("file-input")?.click()}
              disabled={isUploading}
            >
              Browse Files
            </Button>
            <input
              id="file-input"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileInputChange}
              disabled={isUploading}
            />
          </div>
        </div>

        {/* File Preview */}
        {selectedFile && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 flex items-center justify-center bg-white rounded border">
                  {getFileIcon()}
                </div>
                <div>
                  <p className="font-medium text-gray-900 truncate max-w-xs">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              {!isUploading && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearSelection}
                  aria-label="Remove file"
                >
                  <FiX />
                </Button>
              )}
            </div>

            {/* Status Messages */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span
                  className={cn(
                    "font-medium",
                    error
                      ? "text-red-600"
                      : validationResult?.isValid
                      ? "text-green-600"
                      : "text-gray-700"
                  )}
                >
                  {getStatusText()}
                </span>
                {selectedFile && !isUploading && !error && (
                  <span className="text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              {isUploading && (
                <ProgressBar
                  value={uploadProgress}
                  label="Upload progress"
                  showValue
                  variant="default"
                />
              )}

              {/* Validation Results */}
              {validationResult && !isUploading && (
                <div className="space-y-2">
                  {validationResult.errors.length > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-red-700">
                        <FiAlertCircle />
                        <span className="font-medium">Validation Errors</span>
                      </div>
                      <ul className="mt-2 space-y-1 text-sm text-red-600">
                        {validationResult.errors
                          .slice(0, 3)
                          .map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        {validationResult.errors.length > 3 && (
                          <li className="text-red-500">
                            ...and {validationResult.errors.length - 3} more
                            errors
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {validationResult.warnings.length > 0 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-yellow-700">
                        <FiAlertCircle />
                        <span className="font-medium">Warnings</span>
                      </div>
                      <ul className="mt-2 space-y-1 text-sm text-yellow-600">
                        {validationResult.warnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {validationResult.isValid && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-green-700">
                        <FiCheck />
                        <span className="font-medium">
                          File validated successfully
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-green-600">
                        {validationResult.rowCount} rows loaded successfully
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && !validationResult && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-red-700">
                    <FiAlertCircle />
                    <span className="font-medium">Upload Error</span>
                  </div>
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
