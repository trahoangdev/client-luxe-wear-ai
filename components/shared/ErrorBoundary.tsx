"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public handleReload = () => {
    this.setState({ hasError: false, error: null });
    // Optional: window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex h-full w-full flex-col items-center justify-center space-y-4 p-8 text-center bg-muted/10 rounded-lg border border-dashed">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold">Đã xảy ra lỗi</h2>
          <p className="text-muted-foreground max-w-md">
            {this.state.error?.message || "Đã xảy ra lỗi không mong muốn trong thành phần này."}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={this.handleReload}>
              <RotateCw className="mr-2 h-4 w-4" /> Thử lại
            </Button>
            <Button variant="default" onClick={() => window.location.reload()}>
              Tải lại trang
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
