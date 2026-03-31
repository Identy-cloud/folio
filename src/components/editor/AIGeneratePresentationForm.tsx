"use client";

const SLIDE_COUNTS = [4, 6, 8, 10, 12] as const;
const LANGUAGES = [
  { value: "es", label: "Espanol" },
  { value: "en", label: "English" },
  { value: "fr", label: "Francais" },
  { value: "pt", label: "Portugues" },
] as const;

interface Props {
  topic: string;
  onTopicChange: (v: string) => void;
  slideCount: number;
  onSlideCountChange: (v: number) => void;
  language: string;
  onLanguageChange: (v: string) => void;
  style: string;
  onStyleChange: (v: string) => void;
  loading: boolean;
  error: string;
  onGenerate: () => void;
  onClose: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function AIGeneratePresentationForm({
  topic, onTopicChange, slideCount, onSlideCountChange,
  language, onLanguageChange, style, onStyleChange,
  loading, error, onGenerate, onClose, textareaRef,
}: Props) {
  return (
    <div className="space-y-3">
      <textarea
        ref={textareaRef}
        value={topic}
        onChange={(e) => onTopicChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onGenerate();
        }}
        placeholder="Describe your presentation topic..."
        className="h-20 w-full resize-none rounded border border-steel bg-navy px-3 py-2 text-sm text-white outline-none placeholder:text-silver/50 focus:border-silver/50"
        maxLength={2000}
      />

      <div className="flex flex-wrap gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-[10px] text-silver/50 uppercase tracking-wider">
            Slides
          </label>
          <div className="flex gap-1">
            {SLIDE_COUNTS.map((n) => (
              <button
                key={n}
                onClick={() => onSlideCountChange(n)}
                className={`rounded px-2.5 py-1.5 text-xs transition-colors ${
                  slideCount === n
                    ? "bg-accent text-white"
                    : "bg-white/5 text-silver/70 hover:text-white"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-[10px] text-silver/50 uppercase tracking-wider">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="cursor-pointer rounded border border-steel bg-navy px-2 py-1.5 text-xs text-silver outline-none"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>

      <input
        value={style}
        onChange={(e) => onStyleChange(e.target.value)}
        placeholder="Style hints (optional): formal, creative, data-driven..."
        className="w-full rounded border border-steel bg-navy px-3 py-2 text-xs text-white outline-none placeholder:text-silver/50 focus:border-silver/50"
        maxLength={200}
      />

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px] text-silver/40">
          {topic.length}/2000 | Ctrl+Enter to generate
        </span>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="rounded px-3 py-1.5 text-xs text-silver/70 hover:text-silver transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onGenerate}
            disabled={!topic.trim() || loading}
            className="flex items-center gap-1.5 rounded bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-hover disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            {loading && (
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-silver/50 border-t-navy" />
            )}
            {loading ? "Generating..." : "Generate Outline"}
          </button>
        </div>
      </div>
    </div>
  );
}
