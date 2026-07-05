"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Food, Goal, LogEntry, MealCategory, Totals } from "@/types";
import { getLog, saveLog, getGoal, saveGoal, todayKey } from "@/lib/storage";
import { clampGoal, DEFAULT_CALORIE_GOAL, goalFromCalories } from "@/lib/goal";
import { MEALS } from "@/lib/meals";

/** Generates a unique entry id, falling back if crypto.randomUUID is missing. */
function makeEntryId(food: Food): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${food.id}-${Date.now()}-${Math.random()}`;
}

const EMPTY_TOTALS: Totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

function sumTotals(entries: LogEntry[]): Totals {
  return entries.reduce<Totals>(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs,
      fat: acc.fat + e.fat,
    }),
    { ...EMPTY_TOTALS },
  );
}

export type MealGroup = {
  meal: MealCategory;
  entries: LogEntry[];
  totals: Totals;
};

/**
 * Manages today's food log: loads from local storage on mount, exposes
 * add/remove/clear actions plus the daily calorie goal, and persists on every
 * change. Also derives running macro totals and per-meal groupings.
 */
export function useFoodLog() {
  const [date] = useState<string>(todayKey);
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [goalCalories, setGoalCalories] = useState<number>(DEFAULT_CALORIE_GOAL);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted entries + goal once on mount (client only).
  useEffect(() => {
    setEntries(getLog(date));
    const savedGoal = getGoal();
    if (savedGoal != null) setGoalCalories(clampGoal(savedGoal));
    setHydrated(true);
  }, [date]);

  // Persist whenever entries change — but not before the initial load, or we
  // would overwrite stored data with the empty starting state.
  useEffect(() => {
    if (!hydrated) return;
    saveLog(date, entries);
  }, [entries, date, hydrated]);

  const addFood = useCallback((food: Food, meal: MealCategory) => {
    const entry: LogEntry = {
      ...food,
      entryId: makeEntryId(food),
      loggedAt: Date.now(),
      meal,
    };
    setEntries((prev) => [...prev, entry]);
  }, []);

  // Bulk-add several foods in one state update — used when committing a batch of
  // AI-estimated items from the text/photo lookups.
  const addFoods = useCallback((foods: Food[], meal: MealCategory) => {
    if (foods.length === 0) return;
    const now = Date.now();
    const newEntries: LogEntry[] = foods.map((food) => ({
      ...food,
      entryId: makeEntryId(food),
      loggedAt: now,
      meal,
    }));
    setEntries((prev) => [...prev, ...newEntries]);
  }, []);

  const removeEntry = useCallback((entryId: string) => {
    setEntries((prev) => prev.filter((e) => e.entryId !== entryId));
  }, []);

  const clearLog = useCallback(() => {
    setEntries([]);
  }, []);

  const setGoal = useCallback((calories: number) => {
    const clamped = clampGoal(calories);
    setGoalCalories(clamped);
    saveGoal(clamped);
  }, []);

  const totals = useMemo(() => sumTotals(entries), [entries]);

  const goal: Goal = useMemo(
    () => goalFromCalories(goalCalories),
    [goalCalories],
  );

  // Group entries by meal, preserving the canonical meal order and per-meal
  // totals. Only non-empty meals are returned.
  const mealGroups: MealGroup[] = useMemo(() => {
    return MEALS.map(({ id }) => {
      const mealEntries = entries.filter((e) => e.meal === id);
      return { meal: id, entries: mealEntries, totals: sumTotals(mealEntries) };
    }).filter((g) => g.entries.length > 0);
  }, [entries]);

  return {
    date,
    entries,
    totals,
    goal,
    mealGroups,
    hydrated,
    addFood,
    addFoods,
    removeEntry,
    clearLog,
    setGoal,
  };
}
