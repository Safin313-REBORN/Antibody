import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message || 'Unexpected error' };
  }

  componentDidCatch(error: Error) {
    fetch('/api/v1/telemetry/error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message?.slice(0, 280) || 'Render error',
        source: 'react-error-boundary'
      })
    }).catch(() => {});
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-paper text-ink flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-paper border-2 border-vermilion p-6 shadow-ink-lg space-y-4 text-center">
            <span className="rubber-stamp rubber-stamp-danger text-xs">
              SYSTEM RECOVERING
            </span>
            <h1 className="font-serif font-bold text-2xl">Something went wrong</h1>
            <p className="font-sans text-sm text-faded-ink">
              Our field notebook hit an unexpected snag. Reload to continue safely.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="min-h-[48px] px-6 py-2 bg-teal text-paper font-mono text-xs font-bold border-2 border-ink"
            >
              Reload Field Terminal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
