const STORAGE_KEY = "folio-recent-presentations";
const MAX_RECENT = 10;

export interface RecentEntry {
  id: string;
  title: string;
  openedAt: number;
}

export function getRecentPresentations(): RecentEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as RecentEntry[];
  } catch {
    return [];
  }
}

export function trackRecentPresentation(id: string, title: string): void {
  const recent = getRecentPresentations().filter((e) => e.id !== id);
  recent.unshift({ id, title, openedAt: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}
