-- 프로필 테이블에 대한 RLS 정책 추가

-- 1. 사용자가 자신의 프로필을 읽을 수 있도록 허용
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- 2. 모든 사용자가 다른 사용자의 프로필을 읽을 수 있도록 허용 (공개 정보)
CREATE POLICY "Anyone can view profiles" ON profiles
  FOR SELECT USING (true);

-- 3. 사용자가 자신의 프로필을 수정할 수 있도록 허용
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 4. 사용자가 자신의 프로필을 생성할 수 있도록 허용
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 5. 사용자가 자신의 프로필을 삭제할 수 있도록 허용
CREATE POLICY "Users can delete their own profile" ON profiles
  FOR DELETE USING (auth.uid() = id);