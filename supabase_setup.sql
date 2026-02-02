-- 1. Create Nutritional Research Table (Medical Standards)
CREATE TABLE IF NOT EXISTS nutritional_research (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  condition TEXT NOT NULL UNIQUE,
  recommended_ingredients TEXT[] DEFAULT '{}',
  max_sodium INTEGER NOT NULL, -- in mg
  max_sugar INTEGER NOT NULL, -- in g
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Recipes Table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  ingredients JSONB NOT NULL, -- Array of {name, amount, unit, nutrients: [{name, amount, unit}]}
  medical_tags TEXT[] DEFAULT '{}',
  calories INTEGER NOT NULL,
  total_sodium INTEGER, -- in mg
  total_sugar INTEGER, -- in g
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Insert Medical Standards (Nutritional Research)
INSERT INTO nutritional_research (condition, recommended_ingredients, max_sodium, max_sugar)
VALUES 
  ('Diabetes', ARRAY['Leafy Greens', 'Berries', 'Whole Grains', 'Legumes'], 2300, 25),
  ('Heart Disease', ARRAY['Oats', 'Salmon', 'Walnuts', 'Avocado'], 1500, 36),
  ('Cancer', ARRAY['Broccoli', 'Turmeric', 'Garlic', 'Green Tea'], 2300, 30)
ON CONFLICT (condition) DO UPDATE SET
  recommended_ingredients = EXCLUDED.recommended_ingredients,
  max_sodium = EXCLUDED.max_sodium,
  max_sugar = EXCLUDED.max_sugar;

-- 4. Insert Sample USDA-Aligned Recipes
INSERT INTO recipes (title, ingredients, medical_tags, calories, total_sodium, total_sugar)
VALUES 
  (
    'Quinoa & Black Bean Power Bowl',
    '[
      {"name": "Quinoa", "amount": 0.5, "unit": "cup", "nutrients": [{"name": "Protein", "amount": 4, "unit": "g"}]},
      {"name": "Black Beans", "amount": 0.5, "unit": "cup", "nutrients": [{"name": "Fiber", "amount": 7, "unit": "g"}]},
      {"name": "Kale", "amount": 1, "unit": "cup", "nutrients": [{"name": "Vitamin C", "amount": 20, "unit": "mg"}]}
    ]'::jsonb,
    ARRAY['Diabetes Safe', 'Low Sodium', 'High Fiber'],
    320,
    150,
    4
  ),
  (
    'Heart-Healthy Baked Salmon',
    '[
      {"name": "Salmon Fillet", "amount": 6, "unit": "oz", "nutrients": [{"name": "Protein", "amount": 34, "unit": "g"}]},
      {"name": "Asparagus", "amount": 1, "unit": "bunch", "nutrients": [{"name": "Fiber", "amount": 3, "unit": "g"}]},
      {"name": "Olive Oil", "amount": 1, "unit": "tbsp", "nutrients": []}
    ]'::jsonb,
    ARRAY['Heart Healthy', 'Low Carb', 'Omega-3 Rich'],
    450,
    85,
    0
  );

-- 5. Enable RLS
ALTER TABLE nutritional_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- 6. Create Public Read Policies
CREATE POLICY "Allow public read access to research" ON nutritional_research FOR SELECT USING (true);
CREATE POLICY "Allow public read access to recipes" ON recipes FOR SELECT USING (true);
