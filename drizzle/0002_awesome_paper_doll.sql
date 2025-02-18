CREATE TYPE "public"."user_levels" AS ENUM('admin', 'user');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "level" "user_levels" DEFAULT 'user' NOT NULL;