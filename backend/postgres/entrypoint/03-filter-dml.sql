CREATE TABLE temp_top_genre AS SELECT g1.* FROM genre g1 join 
(
    SELECT 
        g.id AS genre_id
    FROM 
        genre g
        LEFT JOIN book_genre_mapping bgm ON g.id = bgm.genre_id
    GROUP BY 
        g.id
    ORDER BY 
        COUNT(bgm.book_id) DESC
    LIMIT 30
) t on t.genre_id = g1.id;

CREATE TABLE temp_top_book_ids AS SELECT distinct(sub.id) id FROM
(
SELECT 
    b.id,
    ROW_NUMBER() OVER(PARTITION BY tg.id ORDER BY b.rating DESC) rn
FROM 
    temp_top_genre tg
    JOIN book_genre_mapping bgm ON tg.id = bgm.genre_id
    JOIN book b ON bgm.book_id = b.id
WHERE 
    b.rating IS NOT NULL
ORDER BY
    tg.id,
    b.rating DESC
) sub
WHERE sub.rn <= 100;

INSERT INTO temp_top_genre 
SELECT * 
FROM genre g 
WHERE g.id IN (
    SELECT bgm.genre_id 
    FROM temp_top_book_ids b 
    JOIN book_genre_mapping bgm ON bgm.book_id = b.id 
    WHERE bgm.genre_id NOT IN (
        SELECT id 
        FROM temp_top_genre
    )
    GROUP BY bgm.genre_id
);

CREATE TABLE temp_top_books AS 
SELECT 
    b.* 
FROM
    book b 
    JOIN temp_top_book_ids t ON t.id = b.id;

CREATE TABLE temp_bgm AS
SELECT 
    bgm.book_id AS old_bid, 
    bgm.genre_id AS old_gid
FROM 
    book_genre_mapping bgm
    JOIN temp_top_books b ON bgm.book_id = b.id
    JOIN temp_top_genre g ON bgm.genre_id = g.id;

TRUNCATE TABLE book_genre_mapping RESTART IDENTITY CASCADE;
TRUNCATE TABLE book RESTART IDENTITY CASCADE;
TRUNCATE TABLE genre RESTART IDENTITY CASCADE;

ALTER TABLE book ADD COLUMN old_bid INT;
ALTER TABLE genre ADD COLUMN old_gid INT;

INSERT INTO book (title, author, rating, image_url, description, isbn, language, old_bid) SELECT title, author, rating, image_url, description, isbn, language, id FROM temp_top_books;
INSERT INTO genre (name, old_gid) SELECT name, id FROM temp_top_genre;
INSERT INTO book_genre_mapping (book_id, genre_id) 
SELECT 
    b.id, 
    g.id 
FROM 
    temp_bgm bgm
    JOIN book b ON bgm.old_bid = b.old_bid
    JOIN genre g ON bgm.old_gid = g.old_gid;

ALTER TABLE book DROP COLUMN old_bid;
ALTER TABLE genre DROP COLUMN old_gid;

DROP TABLE temp_top_genre;
DROP TABLE temp_top_book_ids;
DROP TABLE temp_top_books;
DROP TABLE temp_bgm;
