-- RLS policies for reviews table
-- This file sets up Row Level Security policies for the reviews table

-- Enable RLS on reviews table
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to view all reviews (public read)
CREATE POLICY "Reviews are viewable by everyone"
ON reviews FOR SELECT
USING (true);

-- Policy: Allow authenticated users to insert their own reviews
CREATE POLICY "Users can insert their own reviews"
ON reviews FOR INSERT
WITH CHECK (auth.uid()::text = profile_id);

-- Policy: Allow users to update their own reviews
CREATE POLICY "Users can update their own reviews"
ON reviews FOR UPDATE
USING (auth.uid()::text = profile_id)
WITH CHECK (auth.uid()::text = profile_id);

-- Policy: Allow users to delete their own reviews
CREATE POLICY "Users can delete their own reviews"
ON reviews FOR DELETE
USING (auth.uid()::text = profile_id);