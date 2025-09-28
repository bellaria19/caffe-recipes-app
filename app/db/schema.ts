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
 * 인증 정보는 Supabase Auth에서 관리, 서비스 정보만 저장
 */
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
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
 * 에스프레소 및 드립 커피 레시피의 핵심 정보만 저장
 * 집계 데이터(좋아요, 리뷰 수 등)는 실시간 계산으로 처리
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
    author: text('author'), // 작성자명 (username 캐시)
    bean: text('bean'), // 선택사항: 사용한 원두
    recipeType: text('recipe_type').notNull(), // 'espresso' | 'drip'
    brewingTool: text('brewing_tool'), // 선택사항: 사용한 도구
    tips: text('tips'), // 선택사항: 사용자 팁
    recipeDetails: jsonb('recipe_details').notNull(), // EspressoParams | DripParams
    averageRating: numeric('average_rating', { precision: 2, scale: 1 }).default('0'), // 캐시된 평균 평점 (0.0-5.0)
    totalReviews: integer('total_reviews').default(0), // 캐시된 총 리뷰 수
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
    averageRatingIdx: index('idx_recipes_average_rating').on(table.averageRating.desc()),
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
 * Saved Recipes table - 저장된 레시피
 * 사용자가 저장한(북마크한) 레시피 정보
 */
export const savedRecipes = pgTable(
  'saved_recipes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    profileId: uuid('profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    // 동일 사용자가 같은 레시피를 중복 저장하지 않도록 제약
    uniqueProfileRecipeSave: unique().on(table.profileId, table.recipeId),
    // 성능 최적화를 위한 인덱스
    recipeIdIdx: index('idx_saved_recipes_recipe_id').on(table.recipeId),
    profileIdIdx: index('idx_saved_recipes_profile_id').on(table.profileId),
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
  savedRecipes: many(savedRecipes),
}));

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [recipes.profileId],
    references: [profiles.id],
  }),
  reviews: many(reviews),
  likes: many(likes),
  savedRecipes: many(savedRecipes),
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

export const savedRecipesRelations = relations(savedRecipes, ({ one }) => ({
  profile: one(profiles, {
    fields: [savedRecipes.profileId],
    references: [profiles.id],
  }),
  recipe: one(recipes, {
    fields: [savedRecipes.recipeId],
    references: [recipes.id],
  }),
}));

/**
 * Daily Popular Recipes table - 일간 인기순 레시피
 * Cron job을 통해 매일 계산되는 인기순 데이터
 */
export const dailyPopularRecipes = pgTable(
  'daily_popular_recipes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipes.id),
    likesCount: integer('likes_count').notNull(),
    date: timestamp('date', { mode: 'date', withTimezone: false }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    dateIdx: index('idx_daily_popular_date').on(table.date.desc()),
    recipeIdIdx: index('idx_daily_popular_recipe_id').on(table.recipeId),
  })
);

/**
 * Weekly Popular Recipes table - 주간 인기순 레시피
 * Cron job을 통해 매주 계산되는 인기순 데이터
 */
export const weeklyPopularRecipes = pgTable(
  'weekly_popular_recipes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipes.id),
    likesCount: integer('likes_count').notNull(),
    weekStart: timestamp('week_start', {
      mode: 'date',
      withTimezone: false,
    }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    weekStartIdx: index('idx_weekly_popular_week_start').on(
      table.weekStart.desc()
    ),
    recipeIdIdx: index('idx_weekly_popular_recipe_id').on(table.recipeId),
  })
);

export const dailyPopularRecipesRelations = relations(
  dailyPopularRecipes,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [dailyPopularRecipes.recipeId],
      references: [recipes.id],
    }),
  })
);

export const weeklyPopularRecipesRelations = relations(
  weeklyPopularRecipes,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [weeklyPopularRecipes.recipeId],
      references: [recipes.id],
    }),
  })
);

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
export type DailyPopularRecipe = typeof dailyPopularRecipes.$inferSelect;
export type NewDailyPopularRecipe = typeof dailyPopularRecipes.$inferInsert;
export type WeeklyPopularRecipe = typeof weeklyPopularRecipes.$inferSelect;
export type NewWeeklyPopularRecipe = typeof weeklyPopularRecipes.$inferInsert;

/**
 * 애플리케이션에서 사용하는 레시피 상세 정보 타입
 * recipe_details JSONB 필드에 저장되는 데이터 구조
 */
/**
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

export interface DripParams {
  coffeeAmount: number; // 원두량 (g)
  waterTemperature: number; // 온도 (°C)
  brewingType?: 'hot' | 'ice'; // 추출방식
  dripper?: string; // 드리퍼 종류
  grindSize?: string; // 분쇄도 설명
  grinder?: string; // 그라인더명
  grinderSetting?: string; // 그라인더 설정
  extractionSteps: DripStep[]; // 추출단계
}

export interface DripStep {
  stepName: string; // 단계명 (예: "Blooming", "Pour 1st")
  waterAmount: number; // 물의 양 (g)
  duration?: number; // 시간 (초, 선택사항)
}
*/
