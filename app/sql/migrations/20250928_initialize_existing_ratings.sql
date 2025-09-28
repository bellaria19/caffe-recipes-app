-- Initialize cached rating data for existing recipes
-- This migration populates the new rating cache columns with current data

-- Update all existing recipes with their current rating data
UPDATE recipes
SET
  average_rating = COALESCE((
    SELECT ROUND(AVG(rating::numeric), 1)
    FROM reviews
    WHERE recipe_id = recipes.id
  ), 0),
  total_reviews = COALESCE((
    SELECT COUNT(*)
    FROM reviews
    WHERE recipe_id = recipes.id
  ), 0),
  updated_at = NOW()
WHERE average_rating = 0 AND total_reviews = 0; -- Only update if not already set