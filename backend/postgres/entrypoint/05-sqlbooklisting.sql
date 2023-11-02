ALTER TABLE book_listing
ADD CONSTRAINT uniqueBookandUser UNIQUE (owner_id, book_id);