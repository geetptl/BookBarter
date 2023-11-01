CREATE TABLE temp_books (
    asin TEXT,
    title TEXT,
    author TEXT,
    soldBy TEXT,
    imgUrl TEXT,
    productURL TEXT,
    stars TEXT,
    reviews TEXT,
    price TEXT,
    isKindleUnlimited TEXT,
    category_id TEXT,
    isBestSeller TEXT,
    isEditorsPick TEXT,
    isGoodReadsChoice TEXT,
    publishedDate TEXT,
    category_name TEXT
);

CREATE TABLE temp_books_2 (
    id SERIAL PRIMARY KEY,
    asin TEXT,
    title TEXT,
    author TEXT,
    soldBy TEXT,
    imgUrl TEXT,
    productURL TEXT,
    stars TEXT,
    reviews TEXT,
    price TEXT,
    isKindleUnlimited TEXT,
    category_id TEXT,
    isBestSeller TEXT,
    isEditorsPick TEXT,
    isGoodReadsChoice TEXT,
    publishedDate TEXT,
    category_name TEXT
);

-- This file comes from https://www.kaggle.com/datasets/asaniczka/amazon-kindle-books-dataset-2023-130k-books
\copy temp_books from 'docker-entrypoint-initdb.d/kindle_data-v2.csv' CSV HEADER;

insert into temp_books_2(asin,title,author,soldBy,imgUrl,productURL,stars,reviews,price,isKindleUnlimited,category_id,isBestSeller,isEditorsPick,isGoodReadsChoice,publishedDate,category_name) select asin,title,author,soldBy,imgUrl,productURL,stars,reviews,price,isKindleUnlimited,category_id,isBestSeller,isEditorsPick,isGoodReadsChoice,publishedDate,category_name from temp_books;

delete from temp_books_2 where title is null;
delete from temp_books_2 where author is null;
delete from temp_books_2 where imgUrl is null;
delete from temp_books_2 where stars is null;
delete from temp_books_2 where category_name is null;

delete from temp_books_2 where title = '';
delete from temp_books_2 where author = '';
delete from temp_books_2 where imgUrl = '';
delete from temp_books_2 where stars = '';
delete from temp_books_2 where category_name is null;

insert into genre(name) select DISTINCT category_name from temp_books_2 ON CONFLICT (name) DO NOTHING;;

alter table book add column copy_ref_id int;

insert into book(title, author, rating, image_url, copy_ref_id) select title, author, stars::decimal, imgUrl, id from temp_books_2;

create table temp_genre_mapping as select category_name genre, b.id book_id, b.title from temp_books_2 t join book b on b.copy_ref_id=t.id;

create index temp_genre_mapping_genre on temp_genre_mapping(genre);

alter table book drop column copy_ref_id;

insert into book_genre_mapping (book_id, genre_id) select book_id, g.id genre_id from temp_genre_mapping t join genre g on t.genre=g.name;

drop table temp_books;
drop table temp_books_2;
drop table temp_genre_mapping;