-- Add unique constraint to reviews table to prevent duplicate reviews per user per recipe
-- This ensures one review per user per recipe and enables edit functionality

-- Add unique constraint
ALTER TABLE reviews
ADD CONSTRAINT unique_user_recipe_review
UNIQUE (profile_id, recipe_id);