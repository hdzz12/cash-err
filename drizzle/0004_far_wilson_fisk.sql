ALTER TABLE "users" ALTER COLUMN "password" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "passwordUpdatedAt" timestamp with time zone;