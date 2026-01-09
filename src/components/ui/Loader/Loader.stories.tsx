import type { Meta, StoryObj } from '@storybook/react';

import { ProgressBar } from './ProgressBar';
import { PageLoader } from './PageLoader';
import { Spinner } from './Loader';

const meta: Meta = {
  title: 'UI/Loader',
  tags: ['autodocs'],
};

export default meta;

export const SpinnerVariants: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Sizes</h3>
        <div className="flex items-center space-x-4">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Variants</h3>
        <div className="flex items-center space-x-4">
          <Spinner variant="default" />
          <Spinner variant="primary" />
          <div className="bg-gray-800 p-2 rounded">
            <Spinner variant="white" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">With Label</h3>
        <Spinner label="Loading data..." />
      </div>
    </div>
  ),
};

export const ProgressBarExamples: StoryObj = {
  render: () => (
    <div className="space-y-6 max-w-md">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Default</h3>
        <ProgressBar value={25} />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">With Label and Value</h3>
        <ProgressBar value={60} label="Upload Progress" showValue />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Variants</h3>
        <div className="space-y-4">
          <ProgressBar value={30} variant="success" label="Success" />
          <ProgressBar value={50} variant="warning" label="Warning" />
          <ProgressBar value={90} variant="error" label="Error" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Sizes</h3>
        <div className="space-y-4">
          <ProgressBar value={40} size="sm" label="Small" />
          <ProgressBar value={40} size="md" label="Medium" />
          <ProgressBar value={40} size="lg" label="Large" />
        </div>
      </div>
    </div>
  ),
};

export const PageLoaderExample: StoryObj = {
  render: () => (
    <div className="relative h-64 border border-gray-300 rounded-lg overflow-hidden">
      <div className="p-4">
        <p className="text-gray-600">This is some page content.</p>
      </div>
      <PageLoader message="Processing your file..." overlay />
    </div>
  ),
};