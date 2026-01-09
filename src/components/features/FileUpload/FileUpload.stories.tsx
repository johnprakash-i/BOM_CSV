import type { Meta, StoryObj } from '@storybook/react';
import { FileUpload } from './FileUpload';
import { useState } from 'react';


const meta: Meta<typeof FileUpload> = {
  title: 'Features/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  args: {
    onFileSelect: (file) => console.log('File selected:', file.name),
  },
};

export const WithSelectedFile: Story = {
  args: {
    onFileSelect: (file) => console.log('File selected:', file.name),
  },
  render: (args) => {
    // Mock file for story
    // const mockFile = new File(['test,data'], 'bom-data.csv', { type: 'text/csv' });
    
    return (
      <FileUpload
        {...args}
        // selectedFile={mockFile}
      />
    );
  },
};

export const Uploading: Story = {
  args: {
    onFileSelect: (file) => console.log('File selected:', file.name),
    isUploading: true,
    uploadProgress: 65,
  },
};

export const WithValidationErrors: Story = {
  args: {
    onFileSelect: (file) => console.log('File selected:', file.name),
    validationResult: {
      isValid: false,
      errors: [
        'Row 1: Item Code is required',
        'Row 3: Quantity must be a valid number',
        'Row 5: Estimated Rate must be a valid number',
        'Row 7: Material is required',
      ],
      warnings: ['Found duplicate item codes: ITEM-001, ITEM-003'],
      rowCount: 10,
    },
  },
};

export const WithValidationWarnings: Story = {
  args: {
    onFileSelect: (file) => console.log('File selected:', file.name),
    validationResult: {
      isValid: true,
      errors: [],
      warnings: ['Found duplicate item codes: ITEM-001'],
      rowCount: 15,
    },
  },
};

export const ValidatedSuccessfully: Story = {
  args: {
    onFileSelect: (file) => console.log('File selected:', file.name),
    validationResult: {
      isValid: true,
      errors: [],
      warnings: [],
      rowCount: 25,
    },
  },
};

export const WithUploadError: Story = {
  args: {
    onFileSelect: (file) => console.log('File selected:', file.name),
    error: 'File size exceeds 10MB limit',
  },
};

const InteractiveExample = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <FileUpload
      onFileSelect={handleFileSelect}
      isUploading={isUploading}
      uploadProgress={progress}
    />
  );
};

export const Interactive: Story = {
  render: () => <InteractiveExample />,
};