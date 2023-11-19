-- Member Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    is_auth BOOLEAN DEFAULT FALSE
);

-- Book Table
CREATE TABLE book (
    id SERIAL PRIMARY KEY,
    created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    rating DECIMAL(3,2),
    image_url TEXT NOT NULL,
    description TEXT NOT NULL,
    isbn TEXT NOT NULL,
    language TEXT NOT NULL
);

-- Genre Table
CREATE TABLE genre (
    id SERIAL PRIMARY KEY,
    created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    name TEXT NOT NULL UNIQUE
);

CREATE TYPE listing_status AS ENUM ('Available', 'Not_Available');

-- BookListing Table
CREATE TABLE book_listing (
    id SERIAL PRIMARY KEY,
    created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    owner_id INTEGER REFERENCES users(id),
    book_id INTEGER REFERENCES book(id),
    status listing_status,
    returns_on DATE,
    UNIQUE(owner_id, book_id) 
);

-- BookGenreMapping Table
CREATE TABLE book_genre_mapping (
    id SERIAL PRIMARY KEY,
    created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    book_id INTEGER REFERENCES book(id),
    genre_id INTEGER REFERENCES genre(id)
);

-- Session Table
CREATE TABLE session (
    id SERIAL PRIMARY KEY,
    created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id),
    time_to_live timestamp without time zone
);

-- Create an enumerated type for request statuses
CREATE TYPE request_status AS ENUM ('Pending', 'Accepted', 'Rejected', 'Expired');


-- Request Table
CREATE TABLE request (
    id SERIAL PRIMARY KEY,
    created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    borrower_id INTEGER REFERENCES users(id),
    lender_id INTEGER REFERENCES users(id),
    book_listing_id INTEGER REFERENCES book_listing(id),
    time_to_live timestamp without time zone,
    status request_status
);

-- ExchangeHistory Table
CREATE TABLE exchange_history (
    id SERIAL PRIMARY KEY,
    created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    lender_id INTEGER REFERENCES users(id),
    borrower_id INTEGER REFERENCES users(id),
    book_id INTEGER REFERENCES book(id),
    request_id INTEGER REFERENCES request(id)
); 

-- Payment Table
CREATE TABLE payment (
    id SERIAL PRIMARY KEY,
    created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    req_id INTEGER REFERENCES request(id),
    amount DECIMAL(10, 2),
    txn_id TEXT UNIQUE,
    payment_status TEXT
);

-- -- Cards Tables
CREATE TABLE cards(
    id SERIAL PRIMARY KEY,
    created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    payer_id INTEGER REFERENCES users(id),
    stripe_customer_id TEXT UNIQUE
);