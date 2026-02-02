/**
 * Family Unit Scaling Algorithm
 * Automatically scales ingredients based on household size.
 */

import { Ingredient } from './nutrition';

/**
 * Scales a list of ingredients for a specific household size.
 * @param baseIngredients - Ingredients for a standard serving (usually 1 or 2)
 * @param baseServings - The number of servings the base recipe makes
 * @param householdSize - The target number of people
 */
export const scaleIngredientsForFamily = (
  baseIngredients: Ingredient[],
  baseServings: number,
  householdSize: number
): Ingredient[] => {
  const scaleFactor = householdSize / baseServings;

  return baseIngredients.map(ingredient => ({
    ...ingredient,
    amount: parseFloat((ingredient.amount * scaleFactor).toFixed(2))
  }));
};

/**
 * Calculates total nutritional values for the entire family unit.
 */
export const calculateFamilyNutrientTotals = (
  scaledIngredients: Ingredient[]
): Record<string, number> => {
  const totals: Record<string, number> = {};

  scaledIngredients.forEach(ing => {
    ing.nutrients?.forEach(nut => {
      totals[nut.name] = (totals[nut.name] || 0) + nut.amount;
    });
  });

  return totals;
};
