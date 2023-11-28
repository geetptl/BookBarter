-- Member Table
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    created_on TEXT DEFAULT CURRENT_TIMESTAMP,
    last_updated_on TEXT DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    is_auth BOOLEAN DEFAULT FALSE
);

-- Book Table
CREATE TABLE book (
    id INTEGER PRIMARY KEY,
    created_on TEXT DEFAULT CURRENT_TIMESTAMP,
    last_updated_on TEXT DEFAULT CURRENT_TIMESTAMP,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    rating REAL,
    image_url TEXT NOT NULL,
    description TEXT NOT NULL,
    isbn TEXT NOT NULL,
    language TEXT NOT NULL
);

-- Genre Table
CREATE TABLE genre (
    id INTEGER PRIMARY KEY,
    created_on TEXT DEFAULT CURRENT_TIMESTAMP,
    last_updated_on TEXT DEFAULT CURRENT_TIMESTAMP,
    name TEXT NOT NULL UNIQUE
);

-- BookListing Table
CREATE TABLE book_listing (
    id INTEGER PRIMARY KEY,
    created_on TEXT DEFAULT CURRENT_TIMESTAMP,
    last_updated_on TEXT DEFAULT CURRENT_TIMESTAMP,
    owner_id INTEGER REFERENCES users(id),
    book_id INTEGER REFERENCES book(id),
    status TEXT,
    returns_on TEXT,
    UNIQUE(owner_id, book_id) 
);

-- BookGenreMapping Table
CREATE TABLE book_genre_mapping (
    id INTEGER PRIMARY KEY,
    created_on TEXT DEFAULT CURRENT_TIMESTAMP,
    last_updated_on TEXT DEFAULT CURRENT_TIMESTAMP,
    book_id INTEGER REFERENCES book(id),
    genre_id INTEGER REFERENCES genre(id)
);

-- Session Table
CREATE TABLE session (
    id INTEGER PRIMARY KEY,
    created_on TEXT DEFAULT CURRENT_TIMESTAMP,
    last_updated_on TEXT DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id),
    time_to_live TEXT
);

-- Request Table
CREATE TABLE request (
    id INTEGER PRIMARY KEY,
    created TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified TEXT DEFAULT CURRENT_TIMESTAMP,
    borrower_id INTEGER REFERENCES users(id),
    lender_id INTEGER REFERENCES users(id),
    book_listing_id INTEGER REFERENCES book_listing(id),
    time_to_live TEXT,
    borrow_duration INTEGER NOT NULL,
    status TEXT
);

-- ExchangeHistory Table
CREATE TABLE exchange_history (
    id INTEGER PRIMARY KEY,
    created_on TEXT DEFAULT CURRENT_TIMESTAMP,
    last_updated_on TEXT DEFAULT CURRENT_TIMESTAMP,
    lender_id INTEGER REFERENCES users(id),
    borrower_id INTEGER REFERENCES users(id),
    book_id INTEGER REFERENCES book(id),
    request_id INTEGER REFERENCES request(id)
); 

-- Payment Table
CREATE TABLE payment (
    id INTEGER PRIMARY KEY,
    created_on TEXT DEFAULT CURRENT_TIMESTAMP,
    last_updated_on TEXT DEFAULT CURRENT_TIMESTAMP,
    req_id INTEGER REFERENCES request(id),
    amount REAL,
    payment_intent_id TEXT UNIQUE,
    payment_status TEXT
);

-- Cards Table
CREATE TABLE cards(
    id INTEGER PRIMARY KEY,
    created_on TEXT DEFAULT CURRENT_TIMESTAMP,
    last_updated_on TEXT DEFAULT CURRENT_TIMESTAMP,
    payer_id INTEGER REFERENCES users(id),
    stripe_customer_id TEXT UNIQUE,
    payment_method_id TEXT UNIQUE
);
