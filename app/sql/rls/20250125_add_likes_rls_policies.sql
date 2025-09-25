-- RLS 정책: likes 테이블
-- 사용자는 자신의 likes를 생성, 조회, 삭제할 수 있지만 자신의 레시피는 좋아요 할 수 없습니다

-- 사용자는 자신의 likes를 조회할 수 있습니다
CREATE POLICY "Users can view their own likes" ON public.likes
FOR SELECT USING (auth.uid() = profile_id);

-- 사용자는 자신의 likes를 생성할 수 있지만, 자신의 레시피는 좋아요 할 수 없습니다
CREATE POLICY "Users can create their own likes" ON public.likes
FOR INSERT WITH CHECK (
  auth.uid() = profile_id
  AND auth.uid() != (SELECT profile_id FROM recipes WHERE id = recipe_id)
);

-- 사용자는 자신의 likes를 삭제할 수 있습니다
CREATE POLICY "Users can delete their own likes" ON public.likes
FOR DELETE USING (auth.uid() = profile_id);

-- 모든 사용자는 likes 수를 조회할 수 있습니다 (레시피 카드에 표시용)
CREATE POLICY "Anyone can view likes count" ON public.likes
FOR SELECT USING (true);