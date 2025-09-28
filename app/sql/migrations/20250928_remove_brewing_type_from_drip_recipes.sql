-- Remove brewingType field from existing drip recipe data
-- This migration cleans up the brewingType field that was removed from the DripParams interface

-- Update all drip recipes to remove the brewingType field from recipe_details
UPDATE recipes
SET recipe_details = recipe_details - 'brewingType'
WHERE recipe_type = 'drip'
  AND recipe_details ? 'brewingType';

-- Add comment for documentation
COMMENT ON COLUMN recipes.recipe_details IS 'Recipe parameters in JSON format - EspressoParams for espresso, DripParams for drip (brewingType field removed)';