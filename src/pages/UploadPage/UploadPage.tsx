import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCSVUpload } from '../../hooks';

import {  FileUpload, PageLoader } from '../../components';
import { UI_TEXT } from '../../constants/app.constants';
import { toast } from '../../components/ui/Toaster/Toaster';
import { useTableState } from '../../context/TableContext';


export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const { uploadFile, isUploading, isValidating, validationResult, uploadError, resetUpload } = useCSVUpload();
  const { updateTableData } = useTableState();

  const handleFileSelect = async (file: File) => {
    resetUpload();
    setIsProcessing(true);

    const data = await uploadFile(file);

    if (data && data.length > 0) {
      // Update table state with new data
      updateTableData(data);
      
      // Show success message
      toast.success({
        title: 'File uploaded successfully',
        description: `${data.length} items loaded`,
      });

      // Navigate to table page after a short delay
      setTimeout(() => {
        navigate('/table');
      }, 1000);
    } else {
      toast.error({
        title: 'Upload failed',
        description: uploadError || 'Please check your file and try again',
      });
    }
    
    setIsProcessing(false);
  };




  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {UI_TEXT.APP_TITLE}
              </h1>
              <p className="mt-2 text-gray-600">
                {UI_TEXT.APP_DESCRIPTION}
              </p>
            </div>
       
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* File Upload Section */}
          <div className="mb-8">
            <FileUpload
              onFileSelect={handleFileSelect}
              validationResult={validationResult}
              isUploading={isUploading || isProcessing}
              error={uploadError}
            />
          </div>

    
        </div>
      </main>

      {/* Loading Overlay */}
      {(isUploading || isProcessing) && (
        <PageLoader message={isValidating ? "Validating file..." : "Processing data..."} overlay fullScreen />
      )}
    </div>
  );
};