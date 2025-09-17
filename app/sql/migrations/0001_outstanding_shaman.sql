CREATE TABLE "daily_popular_recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_id" uuid NOT NULL,
	"likes_count" integer NOT NULL,
	"date" timestamp NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
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
ALTER TABLE "weekly_popular_recipes" ADD CONSTRAINT "weekly_popular_recipes_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_daily_popular_date" ON "daily_popular_recipes" USING btree ("date" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_daily_popular_recipe_id" ON "daily_popular_recipes" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "idx_weekly_popular_week_start" ON "weekly_popular_recipes" USING btree ("week_start" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_weekly_popular_recipe_id" ON "weekly_popular_recipes" USING btree ("recipe_id");