"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class EditorErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center bg-navy">
          <div className="text-center">
            <h2 className="font-display text-4xl tracking-tight text-silver">
              SOMETHING WENT WRONG
            </h2>
            <p className="mt-2 text-sm text-silver/50">
              The editor encountered an error. Your work was saved automatically.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => this.setState({ hasError: false })}
                className="bg-accent px-6 py-2.5 text-sm font-medium tracking-widest text-white uppercase hover:bg-accent-hover"
              >
                Retry
              </button>
              <a
                href="/dashboard"
                className="border border-steel/60 px-6 py-2.5 text-sm font-medium tracking-widest text-silver/70 uppercase hover:border-silver hover:text-silver"
              >
                Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
