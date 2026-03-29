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
        <div className="flex h-screen items-center justify-center bg-[#111111]">
          <div className="text-center">
            <h2 className="font-display text-4xl tracking-tight text-neutral-200">
              SOMETHING WENT WRONG
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              The editor encountered an error. Your work was saved automatically.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => this.setState({ hasError: false })}
                className="bg-white px-6 py-2.5 text-sm font-medium tracking-widest text-[#161616] uppercase hover:bg-neutral-200"
              >
                Retry
              </button>
              <a
                href="/dashboard"
                className="border border-neutral-600 px-6 py-2.5 text-sm font-medium tracking-widest text-neutral-400 uppercase hover:border-neutral-400 hover:text-neutral-200"
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
