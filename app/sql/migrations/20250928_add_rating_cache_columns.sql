-- Add rating cache columns to recipes table for performance optimization
-- This migration adds cached rating fields to improve query performance for recipe lists

-- Add rating cache columns
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS average_rating NUMERIC(2,1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- Add index for rating-based sorting
CREATE INDEX IF NOT EXISTS idx_recipes_average_rating ON recipes(average_rating DESC);

-- Add comments for documentation
COMMENT ON COLUMN recipes.average_rating IS 'Cached average rating from reviews (0.0-5.0, updated via trigger)';
COMMENT ON COLUMN recipes.total_reviews IS 'Cached total number of reviews (updated via trigger)';