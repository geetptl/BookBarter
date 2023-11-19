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

-- This file comes from https://zenodo.org/records/4265096
\copy temp_books from 'docker-entrypoint-initdb.d/books_1.Best_Books_Ever.csv' CSV HEADER;

insert into temp_books_2(bookId,title,series,author,rating,description,language,isbn,genres,characters,bookFormat,edition,pages,publisher,publishDate,firstPublishDate,awards,numRatings,ratingsByStars,likedPercent,setting,coverImg,bbeScore,bbeVotes,price)
    select bookId,title,series,author,rating,description,language,isbn,genres,characters,bookFormat,edition,pages,publisher,publishDate,firstPublishDate,awards,numRatings,ratingsByStars,likedPercent,setting,coverImg,bbeScore,bbeVotes,price from temp_books;

delete from temp_books_2 where title is null;
delete from temp_books_2 where author is null;
delete from temp_books_2 where coverImg is null;
delete from temp_books_2 where description is null;
delete from temp_books_2 where rating is null;
delete from temp_books_2 where isbn is null;
delete from temp_books_2 where genres is null;
delete from temp_books_2 where language is null;

delete from temp_books_2 where title = '';
delete from temp_books_2 where author = '';
delete from temp_books_2 where coverImg = '';
delete from temp_books_2 where description = '';
delete from temp_books_2 where rating = '';
delete from temp_books_2 where isbn = '';
delete from temp_books_2 where genres = '';
delete from temp_books_2 where language = '';

insert into genre(name) select trim(both '''' from trim(regexp_split_to_table(trim(trailing ']' from trim(leading '[' from genres)), ','))) from temp_books_2 group by 1;

delete from genre where name='';

alter table book add column copy_ref_id int;

insert into book(title, author, rating, image_url, description, isbn, language, copy_ref_id) select title, author, rating::decimal, coverImg, description, isbn, language, id from temp_books_2;

create table temp_genre_mapping as select trim(both '''' from trim(regexp_split_to_table(trim(trailing ']' from trim(leading '[' from genres)), ','))) genre, b.id book_id, b.title from temp_books_2 t join book b on b.copy_ref_id=t.id;

create index temp_genre_mapping_genre on temp_genre_mapping(genre);

alter table book drop column copy_ref_id;

insert into book_genre_mapping (book_id, genre_id) select book_id, g.id genre_id from temp_genre_mapping t join genre g on t.genre=g.name;

drop table temp_books;
drop table temp_books_2;
drop table temp_genre_mapping;