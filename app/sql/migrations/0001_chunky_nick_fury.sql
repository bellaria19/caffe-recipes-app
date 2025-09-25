CREATE TABLE "saved_recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"recipe_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "saved_recipes_profile_id_recipe_id_unique" UNIQUE("profile_id","recipe_id")
);
--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "author" text;--> statement-breakpoint
ALTER TABLE "saved_recipes" ADD CONSTRAINT "saved_recipes_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_recipes" ADD CONSTRAINT "saved_recipes_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_saved_recipes_recipe_id" ON "saved_recipes" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "idx_saved_recipes_profile_id" ON "saved_recipes" USING btree ("profile_id");