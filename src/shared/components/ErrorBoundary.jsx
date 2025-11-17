import React, { Component } from 'react';
import { Empty } from '@/shared/components/ui/empty';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    const { hasError, error, errorInfo } = this.state;

    if (hasError) {
      const isDev = import.meta.env.NODE_ENV === 'development';

      return (
        <Empty
          title="Something went wrong"
          description={
            isDev && error && errorInfo
              ? (
                <pre className="mt-2 text-sm text-red-500">
                  {error.toString()}
                  <br />
                  {errorInfo.componentStack}
                </pre>
              )
              : 'Please try refreshing the page or contact support.'
          }
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;