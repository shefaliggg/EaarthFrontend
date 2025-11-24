import React, { Component } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components/ui/card";
import { AlertTriangle } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  renderDevStack() {
    const { error, errorInfo } = this.state;

    if (!error || !errorInfo) return null;

    return (
      <pre className="mt-4 max-h-[200px] overflow-auto rounded bg-muted p-3 text-xs text-red-600">
        {error.toString()}
        {"\n"}
        {errorInfo.componentStack}
      </pre>
    );
  }

  render() {
    const { hasError } = this.state;
    const isDev = import.meta.env.DEV;

    if (!hasError) return this.props.children;

    return (
      <div className="flex h-[70vh] w-full items-center justify-center p-6">
        <Card className="w-full max-w-lg border border-red-300">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <CardTitle className="text-xl">Something went wrong</CardTitle>
            </div>
            <CardDescription>
              {isDev
                ? "An unexpected error occurred. Details are shown below."
                : "Please refresh the page or contact support."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isDev && this.renderDevStack()}
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default ErrorBoundary;












