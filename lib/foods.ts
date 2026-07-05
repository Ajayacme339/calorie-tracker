import type { Food } from "@/types";

/**
 * Static database of common foods. Values are approximate, per the serving
 * size listed. This is Phase 1's stand-in for a nutrition API (a later phase
 * will look foods up via the Gemini API).
 */
export const FOODS: Food[] = [
  { id: "chicken-breast", name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: "100g" },
  { id: "white-rice", name: "White Rice (cooked)", calories: 205, protein: 4.3, carbs: 45, fat: 0.4, servingSize: "1 cup" },
  { id: "brown-rice", name: "Brown Rice (cooked)", calories: 216, protein: 5, carbs: 45, fat: 1.8, servingSize: "1 cup" },
  { id: "eggs", name: "Egg (large)", calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, servingSize: "1 egg" },
  { id: "banana", name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, servingSize: "1 medium" },
  { id: "apple", name: "Apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, servingSize: "1 medium" },
  { id: "orange", name: "Orange", calories: 62, protein: 1.2, carbs: 15, fat: 0.2, servingSize: "1 medium" },
  { id: "oatmeal", name: "Oatmeal (cooked)", calories: 158, protein: 6, carbs: 27, fat: 3.2, servingSize: "1 cup" },
  { id: "salmon", name: "Salmon", calories: 208, protein: 20, carbs: 0, fat: 13, servingSize: "100g" },
  { id: "tuna", name: "Tuna (canned in water)", calories: 128, protein: 28, carbs: 0, fat: 1, servingSize: "100g" },
  { id: "broccoli", name: "Broccoli", calories: 55, protein: 3.7, carbs: 11, fat: 0.6, servingSize: "1 cup" },
  { id: "spinach", name: "Spinach (raw)", calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, servingSize: "1 cup" },
  { id: "sweet-potato", name: "Sweet Potato", calories: 112, protein: 2, carbs: 26, fat: 0.1, servingSize: "1 medium" },
  { id: "almonds", name: "Almonds", calories: 164, protein: 6, carbs: 6, fat: 14, servingSize: "1 oz (23 nuts)" },
  { id: "peanut-butter", name: "Peanut Butter", calories: 188, protein: 8, carbs: 6, fat: 16, servingSize: "2 tbsp" },
  { id: "greek-yogurt", name: "Greek Yogurt (plain)", calories: 100, protein: 17, carbs: 6, fat: 0.7, servingSize: "170g" },
  { id: "milk", name: "Milk (2%)", calories: 122, protein: 8, carbs: 12, fat: 4.8, servingSize: "1 cup" },
  { id: "cheddar-cheese", name: "Cheddar Cheese", calories: 113, protein: 7, carbs: 0.4, fat: 9, servingSize: "1 oz" },
  { id: "whole-wheat-bread", name: "Whole Wheat Bread", calories: 81, protein: 4, carbs: 14, fat: 1.1, servingSize: "1 slice" },
  { id: "pasta", name: "Pasta (cooked)", calories: 221, protein: 8, carbs: 43, fat: 1.3, servingSize: "1 cup" },
  { id: "black-beans", name: "Black Beans (cooked)", calories: 227, protein: 15, carbs: 41, fat: 0.9, servingSize: "1 cup" },
  { id: "avocado", name: "Avocado", calories: 240, protein: 3, carbs: 13, fat: 22, servingSize: "1 whole" },
  { id: "ground-beef", name: "Ground Beef (85% lean)", calories: 250, protein: 26, carbs: 0, fat: 15, servingSize: "100g" },
  { id: "tofu", name: "Tofu (firm)", calories: 144, protein: 17, carbs: 3, fat: 9, servingSize: "100g" },
];
