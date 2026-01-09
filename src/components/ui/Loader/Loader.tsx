import React from 'react';
import { cn } from '../../../utils/classNames';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'white';
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  label,
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const variantClasses = {
    default: 'text-gray-400',
    primary: 'text-blue-600',
    white: 'text-white',
  };

  return (
    <div
      className={cn('inline-flex flex-col items-center justify-center', className)}
      role="status"
      aria-live="polite"
      aria-label={label || 'Loading'}
      {...props}
    >
      <svg
        className={cn('animate-spin', sizeClasses[size], variantClasses[variant])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        data-testid="spinner"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {label && (
        <span className="mt-2 text-sm text-gray-600" aria-hidden="true">
          {label}
        </span>
      )}
    </div>
  );
};