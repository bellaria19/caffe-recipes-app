-- Add author field to recipes table
-- This stores the cached username to avoid joins when displaying recipe cards

ALTER TABLE recipes ADD COLUMN author TEXT;

-- Create index for potential searches by author
CREATE INDEX idx_recipes_author ON recipes(author);

-- Update existing recipes with author information from profiles
UPDATE recipes
SET author = profiles.username
FROM profiles
WHERE recipes.profile_id = profiles.id;

-- Add comment for documentation
COMMENT ON COLUMN recipes.author IS '작성자명 (username 캐시) - 성능 최적화를 위해 username을 중복 저장';