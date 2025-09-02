**[Entity 1] 사용자 (User)**

- `id` (uuid, primary key)
- `email` (text, unique)
- `password` (text)
- `username` (text, unique)
- `profile_image_url` (text)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

**[Entity 2] 레시피 (Recipe)**

- `id` (uuid, primary key)
- `user_id` (uuid, references `users(id)`)
- `title` (text)
- `description` (text)
- `bean` (text)
- `recipe_type` (text)
- `brewing_tool` (text)
- `grind_value` (text)
- `recipe_details` (jsonb)
- `likes_count` (integer, default 0)
- `reviews_count` (integer, default 0)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

**[Entity 3] 리뷰 (Review)**

- `id` (uuid, primary key)
- `user_id` (uuid, references `users(id)`)
- `recipe_id` (uuid, references `recipes(id)`)
- `rating` (integer, check `rating` between 1 and 5)
- `content` (text)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

**[Entity 4] 좋아요 (Like)**

- `id` (uuid, primary key)
- `user_id` (uuid, references `users(id)`)
- `recipe_id` (uuid, references `recipes(id)`)
- `created_at` (timestamp with time zone)

---
