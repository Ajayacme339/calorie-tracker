import type { Goal } from "@/types";

/** A reasonable starting budget until the user sets their own. */
export const DEFAULT_CALORIE_GOAL = 2000;

export const MIN_CALORIE_GOAL = 800;
export const MAX_CALORIE_GOAL = 6000;

// Macro split used to derive gram targets from the calorie goal: 30% protein,
// 40% carbs, 30% fat. Protein and carbs are 4 kcal/g, fat is 9 kcal/g.
const SPLIT = { protein: 0.3, carbs: 0.4, fat: 0.3 };

/** Builds a full Goal (calories + macro gram targets) from a calorie number. */
export function goalFromCalories(calories: number): Goal {
  return {
    calories,
    protein: Math.round((calories * SPLIT.protein) / 4),
    carbs: Math.round((calories * SPLIT.carbs) / 4),
    fat: Math.round((calories * SPLIT.fat) / 9),
  };
}

/** Clamps a user-entered goal into a sane range. */
export function clampGoal(calories: number): number {
  if (!Number.isFinite(calories)) return DEFAULT_CALORIE_GOAL;
  return Math.min(MAX_CALORIE_GOAL, Math.max(MIN_CALORIE_GOAL, Math.round(calories)));
}
