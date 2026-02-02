/**
 * USDA FoodData Central & Nutrient Density Helpers
 * Aligns with USDA standards and prioritizes high-density nutrient tagging.
 */

export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  nutrients?: Nutrient[];
}

/**
 * Calculates the Nutrient Density Score (NDS)
 * Based on essential vitamins and minerals relative to caloric content.
 * Higher scores indicate better nutrient density.
 */
export const calculateNutrientDensity = (calories: number, nutrients: Nutrient[]): number => {
  if (calories === 0) return 0;
  
  // Weights for essential nutrients (simplified example)
  const weights: Record<string, number> = {
    'Protein': 1.5,
    'Fiber': 2.0,
    'Vitamin C': 1.2,
    'Iron': 1.5,
    'Calcium': 1.2,
  };

  let totalScore = 0;
  nutrients.forEach(n => {
    if (weights[n.name]) {
      totalScore += (n.amount * weights[n.name]);
    }
  });

  return (totalScore / calories) * 100;
};

/**
 * Tags ingredients based on USDA nutritional standards
 */
export const getNutrientTags = (densityScore: number): string[] => {
  const tags: string[] = [];
  if (densityScore > 80) tags.push('Superfood');
  if (densityScore > 50) tags.push('High Nutrient Density');
  if (densityScore > 20) tags.push('Nutritious');
  return tags;
};
