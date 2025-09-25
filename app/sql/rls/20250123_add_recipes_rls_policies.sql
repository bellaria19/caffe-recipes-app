-- 레시피 테이블에 대한 RLS 정책 추가
-- 이 마이그레이션은 recipes 테이블에 CRUD 작업을 위한 RLS 정책을 설정합니다.

-- 1. 사용자가 자신의 레시피를 생성할 수 있도록 허용
CREATE POLICY "Users can insert their own recipes" ON recipes
  FOR INSERT WITH CHECK (auth.uid() = profile_id::uuid);

-- 2. 모든 사용자가 레시피를 읽을 수 있도록 허용
CREATE POLICY "Anyone can view recipes" ON recipes
  FOR SELECT USING (true);

-- 3. 사용자가 자신의 레시피를 수정할 수 있도록 허용
CREATE POLICY "Users can update their own recipes" ON recipes
  FOR UPDATE USING (auth.uid() = profile_id::uuid);

-- 4. 사용자가 자신의 레시피를 삭제할 수 있도록 허용
CREATE POLICY "Users can delete their own recipes" ON recipes
  FOR DELETE USING (auth.uid() = profile_id::uuid);