-- Create function and trigger to automatically update recipe rating cache
-- This ensures the cached rating data stays in sync with reviews

-- Function to update recipe rating cache
CREATE OR REPLACE FUNCTION update_recipe_rating_cache()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the recipe's cached rating data
  UPDATE recipes
  SET
    average_rating = COALESCE((
      SELECT ROUND(AVG(rating::numeric), 1)
      FROM reviews
      WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
    ), 0),
    total_reviews = COALESCE((
      SELECT COUNT(*)
      FROM reviews
      WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
    ), 0),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.recipe_id, OLD.recipe_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for INSERT, UPDATE, DELETE on reviews
DROP TRIGGER IF EXISTS trigger_update_recipe_rating_cache ON reviews;
CREATE TRIGGER trigger_update_recipe_rating_cache
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_recipe_rating_cache();

-- Add comment for documentation
COMMENT ON FUNCTION update_recipe_rating_cache() IS 'Automatically updates cached rating fields in recipes table when reviews are modified';