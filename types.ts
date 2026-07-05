// Core domain types for the calorie tracker.

/** A food item from the static database. Macros are per single serving. */
export type Food = {
  id: string;
  name: string;
  calories: number; // kcal per serving
  protein: number; // grams per serving
  carbs: number; // grams per serving
  fat: number; // grams per serving
  servingSize: string; // human label, e.g. "100g" or "1 medium"
};

/** Which meal an entry belongs to. Order here is the display order. */
export type MealCategory = "breakfast" | "lunch" | "dinner" | "snack";

/**
 * A logged food entry. Snapshots the food's macros at log time so that
 * later edits to the static food database never rewrite history.
 */
export type LogEntry = Food & {
  entryId: string; // unique per add (crypto.randomUUID)
  loggedAt: number; // epoch milliseconds
  meal: MealCategory; // which meal it was logged under
};

/** Running totals derived from the day's log entries. */
export type Totals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

/** The day's calorie goal plus macro gram targets derived from it. */
export type Goal = {
  calories: number;
  protein: number; // gram target
  carbs: number; // gram target
  fat: number; // gram target
};

/**
 * One food item estimated by the AI nutrition routes. Same macro shape as a
 * static Food but without an `id` — an id is assigned when it's committed to the
 * log. Shared by the server routes (`lib/gemini.ts`) and the client UI.
 */
export type NutritionItem = {
  name: string;
  calories: number; // kcal
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  servingSize: string; // e.g. "1 cup", "150g"
};

/** Structured nutrition result returned by both AI routes. */
export type NutritionResult = {
  items: NutritionItem[];
  total: Totals;
  note?: string; // model's caveat / assumption, if any
};
