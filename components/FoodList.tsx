import type { Food } from "@/types";
import FoodCard from "./FoodCard";

type Props = {
  foods: Food[];
  onAdd: (food: Food) => void;
};

/** Responsive grid of food cards. */
export default function FoodList({ foods, onAdd }: Props) {
  if (foods.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-line-strong bg-surface/60 py-10 text-center text-sm text-ink-soft">
        No foods match your search. Try the Describe or Photo tab instead.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {foods.map((food) => (
        <FoodCard key={food.id} food={food} onAdd={onAdd} />
      ))}
    </div>
  );
}
