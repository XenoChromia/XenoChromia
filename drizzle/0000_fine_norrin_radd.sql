CREATE TABLE "images" (
	"image_id" varchar(100) PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"image_description" text NOT NULL,
	"image_alt" text NOT NULL,
	"image_link" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"template" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"content_paragraphs" text[] NOT NULL
);
--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;