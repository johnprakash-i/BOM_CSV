import { Component } from 'react'; import type { ErrorInfo, ReactNode } from 'react';

import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';
import { Card } from '../ui/Card/Card';
import { Button } from '../ui/Button/Button';


interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-100 text-red-600 mb-6">
                <FiAlertTriangle className="h-8 w-8" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Something went wrong
              </h1>
              
              <p className="text-gray-600 mb-6">
                An unexpected error has occurred. Please try refreshing the page or go back to the upload page.
              </p>

              {this.state.error && (
                <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                  <p className="font-mono text-sm text-gray-700 break-words">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={this.handleReset}
                  leftIcon={<FiRefreshCw />}
                  variant="outline"
                >
                  Try Again
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  leftIcon={<FiHome />}
                >
                  Go to Upload Page
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}