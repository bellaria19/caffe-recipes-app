# Moca Coffee Recipes - Database Schema

이 문서는 Moca 커피 레시피 애플리케이션의 데이터베이스 스키마를 설명합니다.

## 기술 스택

- **Database**: PostgreSQL (via Supabase)
- **ORM**: Drizzle ORM
- **Type Safety**: TypeScript with Drizzle type inference
- **Authentication**: Supabase Auth

## 인증 시스템

사용자의 인증 정보는 **Supabase Auth**에서 관리됩니다.
- 회원가입, 로그인, 소셜 로그인 (Google, Kakao)
- 비밀번호 재설정, 이메일 인증
- JWT 토큰 기반 인증

## 데이터베이스 엔터티

### [Entity 1] 프로필 (Profiles)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  profile_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

**필드 설명:**
- `id`: 사용자 프로필의 고유 식별자 (Supabase Auth와 연동)
- `username`: 사용자 표시명 (고유)
- `profile_image_url`: 프로필 이미지 URL (선택사항)
- `created_at`, `updated_at`: 생성/수정 시간

> **참고**: 이메일, 비밀번호 등 인증 관련 정보는 Supabase Auth에서 관리하므로 profiles 테이블에는 포함되지 않습니다.

### [Entity 2] 레시피 (Recipes)

```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  bean TEXT, -- 선택사항: 사용한 원두
  recipe_type TEXT NOT NULL, -- 'espresso' | 'drip'
  brewing_tool TEXT, -- 선택사항: 사용한 도구
  tips TEXT, -- 선택사항: 사용자 팁
  recipe_details JSONB NOT NULL, -- 각 타입별 필수 파라미터
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

**필드 설명:**
- `id`: 레시피의 고유 식별자
- `profile_id`: 레시피 작성자 참조
- `title`: 레시피 제목 (필수)
- `description`: 레시피 설명 (선택사항)
- `bean`: 사용된 원두 정보 (선택사항)
- `recipe_type`: 레시피 타입 (필수) - 'espresso' 또는 'drip'
- `brewing_tool`: 사용된 도구 (선택사항) - V60, French Press 등
- `tips`: 사용자 팁 (선택사항)
- `recipe_details`: 레시피 타입별 필수 파라미터 (JSON 형태)

**Recipe Types & 필수 파라미터:**

**에스프레소 (espresso):**
```json
{
  "waterTemperature": 92, // 물 온도 (°C)
  "coffeeAmount": 18.0, // 원두량 (g)
  "extractionTime": 28, // 추출시간 (초) 또는 범위
  "extractionAmount": 36 // 추출량 (ml) 또는 범위
}
```

**드립 (drip):**
```json
{
  "coffeeAmount": 22, // 원두량 (g)
  "waterTemperature": 94, // 물 온도 (°C)
  "extractionSteps": [ // 추출 단계들
    {
      "stepName": "Blooming",
      "waterAmount": 40,
      "duration": 30
    }
  ]
}
```

### [Entity 3] 리뷰 (Reviews)

다른 사용자가 레시피에 대해 평점과 코멘트를 남길 수 있습니다.

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id),
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
- `profile_id`: 리뷰 작성자 참조
- `recipe_id`: 평가 대상 레시피 참조
- `rating`: 평점 (1-5점, 제약 조건으로 검증)
- `content`: 리뷰 내용 (선택사항)
- **제약 조건**: 평점은 1-5 사이의 값만 허용

### [Entity 4] 좋아요 (Likes)

다른 사용자가 레시피에 좋아요를 누를 수 있습니다.

```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id),
  recipe_id UUID NOT NULL REFERENCES recipes(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(profile_id, recipe_id)
);
```

**필드 설명:**
- `id`: 좋아요의 고유 식별자
- `profile_id`: 좋아요를 누른 사용자 참조
- `recipe_id`: 좋아요 대상 레시피 참조
- **제약 조건**: 동일 사용자가 같은 레시피에 중복 좋아요 불가

## 관계 (Relations)

### One-to-Many 관계
- **Profiles ← Recipes**: 한 프로필은 여러 레시피 작성 가능
- **Profiles ← Reviews**: 한 프로필은 여러 리뷰 작성 가능
- **Profiles ← Likes**: 한 프로필은 여러 좋아요 가능
- **Recipes ← Reviews**: 한 레시피는 여러 리뷰 받을 수 있음
- **Recipes ← Likes**: 한 레시피는 여러 좋아요 받을 수 있음

## 핵심 비즈니스 룰

1. **인증과 프로필 분리**: Supabase Auth에서 인증 관리, profiles 테이블에서 서비스 정보 관리
2. **레시피 타입**: espresso와 drip 두 가지 타입으로 구분, 각각 다른 필수 파라미터
3. **선택적 정보**: 원두, 도구 정보는 선택사항으로 입력 가능
4. **사용자 인터랙션**: 다른 사용자의 레시피에 좋아요와 리뷰 작성 가능

## TypeScript 타입 정의

Drizzle ORM을 사용하여 스키마에서 자동으로 타입이 생성됩니다:

```typescript
// 데이터베이스 타입들
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;
```

## 애플리케이션 레벨 타입

애플리케이션에서 사용하는 레시피 관련 추가 타입들:

```typescript
// 레시피 타입 구분
export type BrewType = 'all' | 'drip' | 'espresso';
export type SortType = 'popularity' | 'popularity-daily' | 'popularity-weekly' | 'newest';

// 에스프레소 파라미터 (범위 입력 지원)
export interface EspressoParams {
  waterTemperature: number; // 온도 (°C)
  coffeeAmount: number; // 원두량 (g)
  extractionTime?: number; // 추출시간 단일값 (초)
  extractionTimeMin?: number; // 추출시간 최소값 (초)
  extractionTimeMax?: number; // 추출시간 최대값 (초)
  extractionAmount?: number; // 추출량 단일값 (ml)
  extractionAmountMin?: number; // 추출량 최소값 (ml)
  extractionAmountMax?: number; // 추출량 최대값 (ml)
  grindSize?: string; // 분쇄도 설명
  grinder?: string; // 그라인더명
  grinderSetting?: string; // 그라인더 설정
}

// 드립 파라미터
export interface DripParams {
  coffeeAmount: number; // 원두량 (g)
  waterTemperature: number; // 온도 (°C)
  dripper?: string; // 드리퍼 종류
  grindSize?: string; // 분쇄도 설명
  grinder?: string; // 그라인더명
  grinderSetting?: string; // 그라인더 설정
  extractionSteps: DripStep[]; // 추출단계
}

// 드립 추출 단계
export interface DripStep {
  stepName: string; // 단계명 (예: "Blooming", "Pour 1st")
  waterAmount: number; // 물의 양 (g)
  duration?: number; // 시간 (초, 선택사항)
}
```

## 인덱스 권장사항

성능 최적화를 위한 인덱스:

```sql
-- 레시피 검색 최적화
CREATE INDEX idx_recipes_profile_id ON recipes(profile_id);
CREATE INDEX idx_recipes_recipe_type ON recipes(recipe_type);
CREATE INDEX idx_recipes_created_at ON recipes(created_at DESC);

-- 리뷰 검색 최적화
CREATE INDEX idx_reviews_recipe_id ON reviews(recipe_id);
CREATE INDEX idx_reviews_profile_id ON reviews(profile_id);

-- 좋아요 검색 최적화
CREATE INDEX idx_likes_recipe_id ON likes(recipe_id);
CREATE INDEX idx_likes_profile_id ON likes(profile_id);
```

## 확장 계획

현재 구현된 기본 구조 외에 향후 추가될 수 있는 기능들:

1. **레시피 통계 정보**: 별도 테이블로 평점, 좋아요 수, 조회수 등 집계 데이터 관리
2. **원두 정보 정규화**: 원두 정보를 별도 테이블로 분리하여 재사용성 향상
3. **도구 정보 정규화**: 추출 도구 정보를 별도 테이블로 관리
4. **분쇄 설정 상세화**: 그라인더별 분쇄 설정을 별도 테이블로 관리
5. **인기 레시피 캐싱**: 일간/주간 인기 레시피 데이터를 별도 테이블로 관리

## 마이그레이션

Drizzle ORM과 Supabase를 사용하여 마이그레이션 관리:

```bash
# 마이그레이션 생성
npm run db:generate

# 마이그레이션 실행
npm run db:migrate

# Drizzle Studio 실행
npm run db:studio
```

마이그레이션 파일 위치: `./app/sql/migrations/`