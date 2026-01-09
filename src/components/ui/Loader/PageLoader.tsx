import React from 'react';
import { Spinner } from './Loader';


export interface PageLoaderProps {
  message?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Loading...',
  fullScreen = true,
  overlay = false,
}) => {
  if (fullScreen) {
    return (
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${
          overlay ? 'bg-white/80 backdrop-blur-sm' : 'bg-white'
        }`}
        role="status"
        aria-live="polite"
      >
        <Spinner size="lg" variant="primary" label={message} />
        <p className="mt-4 text-lg font-medium text-gray-700">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Spinner size="lg" variant="primary" />
      {message && <p className="mt-4 text-lg font-medium text-gray-700">{message}</p>}
    </div>
  );
};