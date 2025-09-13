# Moca Coffee Recipes - Database Schema

이 문서는 현재 Moca 커피 레시피 애플리케이션의 데이터베이스 스키마를 설명합니다.

## 기술 스택

- **Database**: PostgreSQL (via Supabase)
- **ORM**: Drizzle ORM
- **Type Safety**: TypeScript with Drizzle type inference
- **Authentication**: Supabase Auth

## 데이터베이스 엔터티

### [Entity 1] 사용자 (Users)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  profile_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

**필드 설명:**
- `id`: 사용자의 고유 식별자
- `email`: 사용자 이메일 주소 (로그인용)
- `password`: 해시화된 비밀번호
- `username`: 사용자 표시명 (고유)
- `profile_image_url`: 프로필 이미지 URL (선택사항)
- `created_at`, `updated_at`: 생성/수정 시간

### [Entity 2] 레시피 (Recipes)

```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  bean TEXT,
  recipe_type TEXT,
  brewing_tool TEXT,
  grind_value TEXT,
  recipe_details JSONB,
  rating NUMERIC NOT NULL,
  likes_count INTEGER DEFAULT 0 NOT NULL,
  reviews_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

**필드 설명:**
- `id`: 레시피의 고유 식별자
- `user_id`: 레시피 작성자 참조
- `title`: 레시피 제목
- `description`: 레시피 설명
- `bean`: 사용된 원두 정보
- `recipe_type`: 레시피 타입 (예: espresso, drip)
- `brewing_tool`: 사용된 도구 (예: V60, French Press)
- `grind_value`: 분쇄도 정보
- `recipe_details`: 상세 레시피 정보 (JSON 형태로 저장)
  - 에스프레소: `{ waterTemperature, coffeeAmount, extractionTime, extractionAmount }`
  - 드립: `{ coffeeAmount, waterTemperature, grindSize, brewingType, extractionSteps }`
- `rating`: 평균 평점
- `likes_count`: 좋아요 수 (캐시됨)
- `reviews_count`: 리뷰 수 (캐시됨)

### [Entity 3] 리뷰 (Reviews)

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  recipe_id UUID NOT NULL REFERENCES recipes(id),
  rating INTEGER NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT rating_check CHECK (rating >= 1 AND rating <= 5)
);
```

**필드 설명:**
- `id`: 리뷰의 고유 식별자
- `user_id`: 리뷰 작성자 참조
- `recipe_id`: 평가 대상 레시피 참조
- `rating`: 평점 (1-5점, 제약 조건으로 검증)
- `content`: 리뷰 내용
- **제약 조건**: 평점은 1-5 사이의 값만 허용

### [Entity 4] 좋아요 (Likes)

```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  recipe_id UUID NOT NULL REFERENCES recipes(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  UNIQUE(user_id, recipe_id)
);
```

**필드 설명:**
- `id`: 좋아요의 고유 식별자
- `user_id`: 좋아요를 누른 사용자 참조
- `recipe_id`: 좋아요 대상 레시피 참조
- **제약 조건**: 동일 사용자가 같은 레시피에 중복 좋아요 불가

## 관계 (Relations)

### One-to-Many 관계
- **Users ← Recipes**: 한 사용자는 여러 레시피 작성 가능
- **Users ← Reviews**: 한 사용자는 여러 리뷰 작성 가능
- **Users ← Likes**: 한 사용자는 여러 좋아요 가능
- **Recipes ← Reviews**: 한 레시피는 여러 리뷰 받을 수 있음
- **Recipes ← Likes**: 한 레시피는 여러 좋아요 받을 수 있음

## TypeScript 타입 정의

Drizzle ORM을 사용하여 스키마에서 자동으로 타입이 생성됩니다:

```typescript
// 생성된 타입들
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;
```

## 애플리케이션 레벨 타입

현재 애플리케이션에서 사용하는 추가 타입들:

```typescript
// 레시피 관련 타입
export interface Recipe {
  id: string;
  title: string;
  description?: string;
  brewType: BrewType; // 'all' | 'drip' | 'espresso'
  rating: number;
  author: string;
  image?: string;
  tips?: string;
  createdAt: Date;
  espressoParams?: EspressoParams;
  dripParams?: DripParams;
}

// 에스프레소 파라미터
export interface EspressoParams {
  waterTemperature: number; // 온도 (°C)
  coffeeAmount: number; // 원두량 (g)
  extractionTime: number; // 추출시간 (초)
  extractionAmount: number; // 추출량 (ml)
}

// 드립 파라미터
export interface DripParams {
  coffeeAmount: number; // 원두량 (g)
  waterTemperature: number; // 온도 (°C)
  grindSize?: string; // 분쇄도
  brewingType?: 'hot' | 'ice'; // 추출방식
  extractionSteps: DripStep[]; // 추출단계
}
```

## 인덱스 권장사항

성능 최적화를 위한 인덱스:

```sql
-- 레시피 검색 최적화
CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_recipes_recipe_type ON recipes(recipe_type);
CREATE INDEX idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX idx_recipes_rating ON recipes(rating DESC);

-- 리뷰 검색 최적화
CREATE INDEX idx_reviews_recipe_id ON reviews(recipe_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

-- 좋아요 검색 최적화
CREATE INDEX idx_likes_recipe_id ON likes(recipe_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
```

## 마이그레이션

Drizzle ORM을 사용하여 마이그레이션 관리:

```bash
# 마이그레이션 생성
npx drizzle-kit generate

# 마이그레이션 실행
npx drizzle-kit migrate
```

마이그레이션 파일 위치: `./app/migrations/`