import { relations, sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

/**
 * Profiles table - 사용자 정보
 * Supabase Auth와 연동되는 사용자 프로필 정보
 */
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  username: text('username').notNull().unique(),
  profileImageUrl: text('profile_image_url'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/**
 * Recipes table - 커피 레시피
 * 에스프레소 및 드립 커피 레시피 정보 저장
 * recipe_details JSONB 필드에 상세 추출 파라미터 저장
 */
export const recipes = pgTable(
  'recipes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    profileId: uuid('profile_id')
      .notNull()
      .references(() => profiles.id),
    title: text('title').notNull(),
    description: text('description'),
    bean: text('bean'), // 사용된 원두 정보
    recipeType: text('recipe_type'), // 'espresso' | 'drip'
    brewingTool: text('brewing_tool'), // V60, French Press, etc.
    grindValue: text('grind_value'), // 분쇄도 정보
    recipeDetails: jsonb('recipe_details'), // EspressoParams | DripParams
    rating: numeric('rating').notNull().default('0'), // 평균 평점
    likesCount: integer('likes_count').default(0).notNull(),
    reviewsCount: integer('reviews_count').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    // 성능 최적화를 위한 인덱스
    profileIdIdx: index('idx_recipes_profile_id').on(table.profileId),
    recipeTypeIdx: index('idx_recipes_recipe_type').on(table.recipeType),
    createdAtIdx: index('idx_recipes_created_at').on(table.createdAt.desc()),
    ratingIdx: index('idx_recipes_rating').on(table.rating.desc()),
  })
);

/**
 * Reviews table - 레시피 리뷰
 * 사용자가 레시피에 대해 남긴 평점과 코멘트
 */
export const reviews = pgTable(
  'reviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    profileId: uuid('profile_id')
      .notNull()
      .references(() => profiles.id),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipes.id),
    rating: integer('rating').notNull(),
    content: text('content'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    // 평점 범위 제약 조건 (1-5점)
    ratingCheck: check(
      'rating_check',
      sql`${table.rating} >= 1 AND ${table.rating} <= 5`
    ),
    // 성능 최적화를 위한 인덱스
    recipeIdIdx: index('idx_reviews_recipe_id').on(table.recipeId),
    profileIdIdx: index('idx_reviews_profile_id').on(table.profileId),
  })
);

/**
 * Likes table - 레시피 좋아요
 * 사용자가 레시피에 누른 좋아요 정보
 */
export const likes = pgTable(
  'likes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    profileId: uuid('profile_id')
      .notNull()
      .references(() => profiles.id),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipes.id),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    // 동일 사용자가 같은 레시피에 중복 좋아요 방지
    uniqueProfileRecipeLike: unique().on(table.profileId, table.recipeId),
    // 성능 최적화를 위한 인덱스
    recipeIdIdx: index('idx_likes_recipe_id').on(table.recipeId),
    profileIdIdx: index('idx_likes_profile_id').on(table.profileId),
  })
);

/**
 * Drizzle ORM Relations 정의
 * 테이블 간 관계를 정의하여 조인 쿼리 최적화
 */
export const profilesRelations = relations(profiles, ({ many }) => ({
  recipes: many(recipes),
  reviews: many(reviews),
  likes: many(likes),
}));

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [recipes.profileId],
    references: [profiles.id],
  }),
  reviews: many(reviews),
  likes: many(likes),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  profile: one(profiles, {
    fields: [reviews.profileId],
    references: [profiles.id],
  }),
  recipe: one(recipes, {
    fields: [reviews.recipeId],
    references: [recipes.id],
  }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  profile: one(profiles, {
    fields: [likes.profileId],
    references: [profiles.id],
  }),
  recipe: one(recipes, {
    fields: [likes.recipeId],
    references: [recipes.id],
  }),
}));

/**
 * TypeScript 타입 정의
 * Drizzle ORM에서 자동으로 추론되는 타입들
 */
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;

/**
 * 애플리케이션에서 사용하는 레시피 상세 정보 타입
 * recipe_details JSONB 필드에 저장되는 데이터 구조
 */
export interface EspressoParams {
  waterTemperature: number; // 온도 (°C)
  coffeeAmount: number; // 원두량 (g)
  extractionTime: number; // 추출시간 (초)
  extractionAmount: number; // 추출량 (ml)
}

export interface DripParams {
  coffeeAmount: number; // 원두량 (g)
  waterTemperature: number; // 온도 (°C)
  grindSize?: string; // 분쇄도
  brewingType?: 'hot' | 'ice'; // 추출방식
  extractionSteps: DripStep[]; // 추출단계
}

export interface DripStep {
  stepName: string; // 단계명 (예: "Blooming", "Pour 1st")
  waterAmount: number; // 물의 양 (ml)
  duration?: number; // 시간 (초)
}
