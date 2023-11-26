-- Create temp_books table
CREATE TABLE temp_books (
    bookId TEXT,
    title TEXT,
    series TEXT,
    author TEXT,
    rating TEXT,
    description TEXT,
    language TEXT,
    isbn TEXT,
    genres TEXT,
    characters TEXT,
    bookFormat TEXT,
    edition TEXT,
    pages TEXT,
    publisher TEXT,
    publishDate TEXT,
    firstPublishDate TEXT,
    awards TEXT,
    numRatings TEXT,
    ratingsByStars TEXT,
    likedPercent TEXT,
    setting TEXT,
    coverImg TEXT,
    bbeScore TEXT,
    bbeVotes TEXT,
    price TEXT
);

-- Create temp_books_2 table with an additional primary key
CREATE TABLE temp_books_2 (
    id SERIAL PRIMARY KEY,
    bookId TEXT,
    title TEXT,
    series TEXT,
    author TEXT,
    rating TEXT,
    description TEXT,
    language TEXT,
    isbn TEXT,
    genres TEXT,
    characters TEXT,
    bookFormat TEXT,
    edition TEXT,
    pages TEXT,
    publisher TEXT,
    publishDate TEXT,
    firstPublishDate TEXT,
    awards TEXT,
    numRatings TEXT,
    ratingsByStars TEXT,
    likedPercent TEXT,
    setting TEXT,
    coverImg TEXT,
    bbeScore TEXT,
    bbeVotes TEXT,
    price TEXT
);

-- Import data from CSV file into temp_books
-- Note: This file comes from https://zenodo.org/records/4265096
\copy temp_books from 'docker-entrypoint-initdb.d/books_1.Best_Books_Ever.csv' CSV HEADER;

-- Insert data from temp_books to temp_books_2
INSERT INTO temp_books_2(bookId, title, series, author, rating, description, language, isbn, genres, characters, bookFormat, edition, pages, publisher, publishDate, firstPublishDate, awards, numRatings, ratingsByStars, likedPercent, setting, coverImg, bbeScore, bbeVotes, price)
SELECT bookId, title, series, author, rating, description, language, isbn, genres, characters, bookFormat, edition, pages, publisher, publishDate, firstPublishDate, awards, numRatings, ratingsByStars, likedPercent, setting, coverImg, bbeScore, bbeVotes, price 
FROM temp_books;

-- Delete records with null or empty values in specified columns
DELETE FROM temp_books_2 WHERE title IS NULL OR title = '';
DELETE FROM temp_books_2 WHERE author IS NULL OR author = '';
DELETE FROM temp_books_2 WHERE coverImg IS NULL OR coverImg = '';
DELETE FROM temp_books_2 WHERE description IS NULL OR description = '';
DELETE FROM temp_books_2 WHERE rating IS NULL OR rating = '';
DELETE FROM temp_books_2 WHERE isbn IS NULL OR isbn = '';
DELETE FROM temp_books_2 WHERE genres IS NULL OR genres = '';
DELETE FROM temp_books_2 WHERE language IS NULL OR language = '';

-- Insert genres into genre table
INSERT INTO genre(name) 
SELECT DISTINCT TRIM(BOTH '''' FROM TRIM(REGEXP_SPLIT_TO_TABLE(TRIM(TRAILING ']' FROM TRIM(LEADING '[' FROM genres)), ','))) 
FROM temp_books_2 
WHERE genres IS NOT NULL AND genres != '';

-- Remove empty genre names
DELETE FROM genre WHERE name = '';

-- Add a copy reference ID to book table
ALTER TABLE book ADD COLUMN copy_ref_id INT;

-- Insert data into book table from temp_books_2
INSERT INTO book(title, author, rating, image_url, description, isbn, language, copy_ref_id) 
SELECT title, author, rating::DECIMAL, coverImg, description, isbn, language, id 
FROM temp_books_2;

-- Create temporary genre mapping table
CREATE TABLE temp_genre_mapping AS 
SELECT TRIM(BOTH '''' FROM TRIM(REGEXP_SPLIT_TO_TABLE(TRIM(TRAILING ']' FROM TRIM(LEADING '[' FROM genres)), ','))) AS genre, 
       b.id AS book_id, 
       b.title 
FROM temp_books_2 t 
JOIN book b ON b.copy_ref_id = t.id;

-- Create index on temp_genre_mapping for genre
CREATE INDEX temp_genre_mapping_genre ON temp_genre_mapping(genre);

-- Remove the copy_ref_id column from book table
ALTER TABLE book DROP COLUMN copy_ref_id;

-- Insert data into book_genre_mapping table
INSERT INTO book_genre_mapping (book_id, genre_id) 
SELECT book_id, g.id AS genre_id 
FROM temp_genre_mapping t 
JOIN genre g ON t.genre = g.name;

-- Drop temporary tables
DROP TABLE temp_books;
DROP TABLE temp_books_2;
DROP TABLE temp_genre_mapping;