"use client";

import { useEffect, useMemo, useState } from "react";
import type { Food, MealCategory } from "@/types";
import { FOODS } from "@/lib/foods";
import { defaultMealForNow } from "@/lib/meals";
import { useFoodLog } from "@/hooks/useFoodLog";
import Header from "@/components/Header";
import DailySummary from "@/components/DailySummary";
import MealSelector from "@/components/MealSelector";
import SearchBar from "@/components/SearchBar";
import FoodList from "@/components/FoodList";
import DailyLog from "@/components/DailyLog";
import AddFoodTabs, { type AddMode } from "@/components/AddFoodTabs";
import TextLookup from "@/components/TextLookup";
import PhotoLookup from "@/components/PhotoLookup";

export default function Home() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<AddMode>("quick");
  const [meal, setMeal] = useState<MealCategory>("breakfast");
  const {
    date,
    entries,
    totals,
    goal,
    mealGroups,
    addFood,
    addFoods,
    removeEntry,
    clearLog,
    setGoal,
  } = useFoodLog();

  // Default the target meal to the current time of day (client-only to avoid a
  // hydration mismatch on server-rendered HTML).
  useEffect(() => {
    setMeal(defaultMealForNow());
  }, []);

  const filteredFoods = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FOODS;
    return FOODS.filter((f) => f.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="min-h-screen">
      <Header dateKey={date} />

      <main className="mx-auto max-w-3xl space-y-6 px-4 pb-16 pt-5">
        <DailySummary
          totals={totals}
          goal={goal}
          itemCount={entries.length}
          onSetGoal={setGoal}
        />

        <section className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
          <h2 className="mb-3 text-lg font-bold text-ink">Add food</h2>

          <div className="space-y-4">
            <MealSelector value={meal} onChange={setMeal} />
            <AddFoodTabs mode={mode} onChange={setMode} />

            {mode === "quick" && (
              <div className="space-y-4">
                <SearchBar value={query} onChange={setQuery} />
                <FoodList
                  foods={filteredFoods}
                  onAdd={(food: Food) => addFood(food, meal)}
                />
              </div>
            )}
            {mode === "text" && (
              <TextLookup onCommit={(foods) => addFoods(foods, meal)} />
            )}
            {mode === "photo" && (
              <PhotoLookup onCommit={(foods) => addFoods(foods, meal)} />
            )}
          </div>
        </section>

        <DailyLog
          mealGroups={mealGroups}
          onRemove={removeEntry}
          onClear={clearLog}
        />

        <footer className="pt-2 text-center text-xs text-ink-faint">
          Nutrition values are estimates. Your log is saved on this device.
        </footer>
      </main>
    </div>
  );
}
