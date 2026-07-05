import type { MealCategory } from "@/types";

/** Display metadata for each meal category, in the order they should appear. */
export const MEALS: { id: MealCategory; label: string }[] = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snack", label: "Snack" },
];

/** A sensible default meal based on the current hour, so adds land in the
 *  right place without the user having to think about it. */
export function defaultMealForNow(date = new Date()): MealCategory {
  const h = date.getHours();
  if (h < 11) return "breakfast";
  if (h < 15) return "lunch";
  if (h < 21) return "dinner";
  return "snack";
}

export function mealLabel(meal: MealCategory): string {
  return MEALS.find((m) => m.id === meal)?.label ?? meal;
}
