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
        <div className="flex h-screen items-center justify-center bg-neutral-100">
          <div className="text-center">
            <h2 className="font-display text-4xl tracking-tight">
              ALGO SALIÓ MAL
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              El editor encontró un error. Tu trabajo fue guardado
              automáticamente.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-6 bg-neutral-900 px-6 py-2.5 text-sm font-medium tracking-widest text-white uppercase hover:bg-neutral-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
