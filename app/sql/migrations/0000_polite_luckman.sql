CREATE TABLE "daily_popular_recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_id" uuid NOT NULL,
	"likes_count" integer NOT NULL,
	"date" timestamp NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"recipe_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "likes_profile_id_recipe_id_unique" UNIQUE("profile_id","recipe_id")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"profile_image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"bean" text,
	"recipe_type" text NOT NULL,
	"brewing_tool" text,
	"tips" text,
	"recipe_details" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"recipe_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"content" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rating_check" CHECK ("reviews"."rating" >= 1 AND "reviews"."rating" <= 5)
);
--> statement-breakpoint
CREATE TABLE "weekly_popular_recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_id" uuid NOT NULL,
	"likes_count" integer NOT NULL,
	"week_start" timestamp NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "daily_popular_recipes" ADD CONSTRAINT "daily_popular_recipes_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_popular_recipes" ADD CONSTRAINT "weekly_popular_recipes_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_daily_popular_date" ON "daily_popular_recipes" USING btree ("date" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_daily_popular_recipe_id" ON "daily_popular_recipes" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "idx_likes_recipe_id" ON "likes" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "idx_likes_profile_id" ON "likes" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "idx_recipes_profile_id" ON "recipes" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "idx_recipes_recipe_type" ON "recipes" USING btree ("recipe_type");--> statement-breakpoint
CREATE INDEX "idx_recipes_created_at" ON "recipes" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_reviews_recipe_id" ON "reviews" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "idx_reviews_profile_id" ON "reviews" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "idx_weekly_popular_week_start" ON "weekly_popular_recipes" USING btree ("week_start" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_weekly_popular_recipe_id" ON "weekly_popular_recipes" USING btree ("recipe_id");