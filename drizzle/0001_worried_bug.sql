CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"username" varchar(50) NOT NULL,
	"password" varchar(50) NOT NULL
);
--> statement-breakpoint
DROP TABLE "cash-err_post" CASCADE;