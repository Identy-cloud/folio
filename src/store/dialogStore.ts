import { create } from "zustand";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: "danger" | "default";
}

interface PromptOptions {
  title: string;
  message: string;
  placeholder?: string;
  defaultValue?: string;
  confirmLabel?: string;
}

interface DialogState {
  type: "confirm" | "prompt" | null;
  title: string;
  message: string;
  placeholder: string;
  defaultValue: string;
  confirmLabel: string;
  confirmVariant: "danger" | "default";
  resolve: ((value: boolean | string | null) => void) | null;
  showConfirm: (opts: ConfirmOptions) => Promise<boolean>;
  showPrompt: (opts: PromptOptions) => Promise<string | null>;
  _resolve: (value: boolean | string | null) => void;
}

export const useDialogStore = create<DialogState>((set, get) => ({
  type: null,
  title: "",
  message: "",
  placeholder: "",
  defaultValue: "",
  confirmLabel: "OK",
  confirmVariant: "default",
  resolve: null,

  showConfirm: (opts) =>
    new Promise<boolean>((resolve) => {
      set({
        type: "confirm",
        title: opts.title,
        message: opts.message,
        confirmLabel: opts.confirmLabel ?? "Confirm",
        confirmVariant: opts.confirmVariant ?? "default",
        placeholder: "",
        defaultValue: "",
        resolve: resolve as (value: boolean | string | null) => void,
      });
    }),

  showPrompt: (opts) =>
    new Promise<string | null>((resolve) => {
      set({
        type: "prompt",
        title: opts.title,
        message: opts.message,
        placeholder: opts.placeholder ?? "",
        defaultValue: opts.defaultValue ?? "",
        confirmLabel: opts.confirmLabel ?? "OK",
        confirmVariant: "default",
        resolve: resolve as (value: boolean | string | null) => void,
      });
    }),

  _resolve: (value) => {
    const { resolve } = get();
    if (resolve) resolve(value);
    set({ type: null, resolve: null });
  },
}));
