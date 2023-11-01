CREATE TABLE temp_books (
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
    bbeScore TEXT,
    bbeVotes TEXT,
    price TEXT
);

CREATE TABLE temp_books_2 (
    id SERIAL PRIMARY KEY,
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
    bbeScore TEXT,
    bbeVotes TEXT,
    price TEXT
);

\copy temp_books from 'docker-entrypoint-initdb.d/books.csv' CSV HEADER;

insert into temp_books_2(title,series,author,rating,description,language,isbn,genres,characters,bookFormat,edition,pages,publisher,publishDate,firstPublishDate,awards,numRatings,ratingsByStars,likedPercent,setting,bbeScore,bbeVotes,price) select title,series,author,rating,description,language,isbn,genres,characters,bookFormat,edition,pages,publisher,publishDate,firstPublishDate,awards,numRatings,ratingsByStars,likedPercent,setting,bbeScore,bbeVotes,price from temp_books;

insert into genre(name) select trim(both '''' from trim(regexp_split_to_table(trim(trailing ']' from trim(leading '[' from genres)), ','))) from temp_books_2 group by 1;

alter table book add column copy_ref_id int;

insert into book(title, author, rating, description, language, isbn, copy_ref_id) select title, author, rating::decimal, description, language, isbn, id from temp_books_2;

create table temp_genre_mapping as select trim(both '''' from trim(regexp_split_to_table(trim(trailing ']' from trim(leading '[' from genres)), ','))) genre, b.id book_id, b.title from temp_books_2 t join book b on b.copy_ref_id=t.id;

alter table book drop column copy_ref_id;

insert into book_genre_mapping (book_id, genre_id) select book_id, g.id genre_id from temp_genre_mapping t join genre g on t.genre=g.name;

drop table temp_books;
drop table temp_books_2;
drop table temp_genre_mapping;