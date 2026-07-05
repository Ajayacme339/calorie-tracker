import type { LogEntry } from "@/types";

// Local "database" layer backed by the browser's localStorage. Kept behind
// this module so the rest of the app depends on an interface, not on
// localStorage directly — swapping in IndexedDB or SQLite later means changing
// only this file.

const KEY_PREFIX = "calorie-tracker";

/** Returns today's date as a YYYY-MM-DD string in the user's local timezone. */
export function todayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function storageKey(date: string): string {
  return `${KEY_PREFIX}:${date}`;
}

/** Reads the log entries stored for a given date. Safe to call on the server. */
export function getLog(date: string): LogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(date));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LogEntry[]) : [];
  } catch {
    // Corrupt/unavailable storage — fail soft with an empty log.
    return [];
  }
}

/** Persists the log entries for a given date. No-op on the server. */
export function saveLog(date: string, entries: LogEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(date), JSON.stringify(entries));
  } catch {
    // Quota exceeded or storage disabled — ignore; UI state still holds.
  }
}

const GOAL_KEY = `${KEY_PREFIX}:goal`;

/** Reads the saved daily calorie goal, or null if none is stored yet. */
export function getGoal(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(GOAL_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

/** Persists the daily calorie goal. No-op on the server. */
export function saveGoal(calories: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(GOAL_KEY, String(calories));
  } catch {
    // ignore
  }
}
