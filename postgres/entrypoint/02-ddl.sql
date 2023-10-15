-- Member Table
CREATE TABLE member (
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
    description TEXT,
    language TEXT,
    isbn TEXT UNIQUE
);

-- Genre Table
CREATE TABLE genre (
    id SERIAL PRIMARY KEY,
    created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    name TEXT NOT NULL UNIQUE
);

-- BookListing Table
CREATE TABLE book_listing (
    id SERIAL PRIMARY KEY,
    created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    owner_id INTEGER REFERENCES member(id),
    book_id INTEGER REFERENCES book(id),
    status TEXT,
    status_code INTEGER,
    returns_on DATE
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
    user_id INTEGER REFERENCES member(id),
    time_to_live timestamp without time zone
);

-- Request Table
CREATE TABLE request (
    id SERIAL PRIMARY KEY,
    created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    borrower_id INTEGER REFERENCES member(id),
    lender_id INTEGER REFERENCES member(id),
    book_listing_id INTEGER REFERENCES book_listing(id),
    time_to_live timestamp without time zone,
    status TEXT,
    status_code INTEGER
);

-- ExchangeHistory Table
CREATE TABLE exchange_history (
    id SERIAL PRIMARY KEY,
    created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    lender_id INTEGER REFERENCES member(id),
    borrower_id INTEGER REFERENCES member(id),
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
