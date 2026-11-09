CREATE TABLE "records" (
	"id" uuid PRIMARY KEY NOT NULL,
	"person_id" uuid NOT NULL,
	"form" text NOT NULL,
	"original_name" text,
	"file_count" integer NOT NULL,
	"content_hash" text NOT NULL,
	"kind" text,
	"record_date" date,
	"uploaded_at" timestamp with time zone NOT NULL,
	CONSTRAINT "records_person_content_hash_unique" UNIQUE("person_id","content_hash")
);
--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "records_person_uploaded_idx" ON "records" USING btree ("person_id","uploaded_at");