'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Reusable Error Boundary with good UX.
 * 
 * Best practices:
 * - Catches rendering errors gracefully
 * - Shows calm, actionable error UI
 * - Easy to customize fallback
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400">
          <h3 className="font-semibold mb-2">Something went wrong</h3>
          <p className="text-sm opacity-80 mb-4">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 text-sm rounded-lg border border-red-500/40 hover:bg-red-950/40 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
