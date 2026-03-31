"use client";

import { Trash, Eye, EyeSlash, FolderOpen, X } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";

interface Props {
  count: number;
  onDelete: () => void;
  onMakePublic: () => void;
  onMakePrivate: () => void;
  onMoveToFolder: () => void;
  onCancel: () => void;
}

export function BulkActionBar({
  count,
  onDelete,
  onMakePublic,
  onMakePrivate,
  onMoveToFolder,
  onCancel,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-silver/30 bg-white/95 backdrop-blur-sm lg:sticky lg:top-0 lg:bottom-auto lg:border-t-0 lg:border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3">
        <span className="text-sm font-medium text-navy">
          {count} {t.dashboard.bulkSelected}
        </span>

        <div className="flex items-center gap-1">
          <BulkButton
            icon={<FolderOpen size={16} />}
            label={t.dashboard.bulkMove}
            onClick={onMoveToFolder}
          />
          <BulkButton
            icon={<Eye size={16} />}
            label={t.dashboard.bulkMakePublic}
            onClick={onMakePublic}
          />
          <BulkButton
            icon={<EyeSlash size={16} />}
            label={t.dashboard.bulkMakePrivate}
            onClick={onMakePrivate}
          />
          <BulkButton
            icon={<Trash size={16} />}
            label={t.common.delete}
            onClick={onDelete}
            destructive
          />
          <button
            onClick={onCancel}
            className="ml-2 flex h-11 w-11 items-center justify-center rounded text-slate hover:bg-[#FAFAFA] hover:text-navy transition-colors lg:h-auto lg:w-auto lg:px-3 lg:py-2"
            aria-label={t.common.cancel}
          >
            <X size={16} className="lg:mr-1" />
            <span className="hidden lg:inline text-xs">{t.common.cancel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function BulkButton({
  icon,
  label,
  onClick,
  destructive,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-11 items-center gap-1.5 rounded px-3 py-2 text-xs font-medium transition-colors ${
        destructive
          ? "text-red-500 hover:bg-red-50"
          : "text-slate hover:bg-[#FAFAFA]"
      }`}
      title={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
