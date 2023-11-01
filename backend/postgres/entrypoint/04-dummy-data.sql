-- Users
INSERT INTO users (user_id, password_hash, email, first_name, last_name)
VALUES 
('user1', 'hashed_pass1', 'user1@email.com', 'User', 'One'),
('user2', 'hashed_pass2', 'user2@email.com', 'User', 'Two'),
('user3', 'hashed_pass3', 'user3@email.com', 'User', 'Three'),
('user4', 'hashed_pass4', 'user4@email.com', 'User', 'Four');

-- Book
INSERT INTO book (title, author, rating, description, language, isbn)
VALUES 
('Book One', 'Author One', 4.5, 'Description for book one', 'English', '1234567890123'),
('Book Two', 'Author Two', 4.0, 'Description for book two', 'English', '1234567890124'),
('Book Three', 'Author Three', 3.5, 'Description for book three', 'Spanish', '1234567890125'),
('Book Four', 'Author Four', 4.7, 'Description for book four', 'French', '1234567890126');

-- Genre
INSERT INTO genre (name)
VALUES 
('Fiction'),
('Non-Fiction'),
('Romance'),
('Thriller');

-- BookListing
INSERT INTO book_listing (owner_id, book_id, status, status_code)
VALUES 
(1, 1, 'Available', 1),
(2, 2, 'Available', 1),
(3, 3, 'Not Available', 0),
(4, 4, 'Available', 1);

-- BookGenreMapping
INSERT INTO book_genre_mapping (book_id, genre_id)
VALUES 
(1, 1),
(2, 2),
(3, 3),
(4, 4);

-- Session
INSERT INTO session (user_id, time_to_live)
VALUES 
(1, '2024-01-01 12:00:00'),
(2, '2024-01-02 12:00:00'),
(3, '2024-01-03 12:00:00'),
(4, '2024-01-04 12:00:00');

-- Request
INSERT INTO request (borrower_id, lender_id, book_listing_id, time_to_live, status, status_code)
VALUES 
(1, 2, 2, '2024-01-05 12:00:00', 'Pending', 0),
(3, 4, 4, '2024-01-06 12:00:00', 'Accepted', 1),
(4, 1, 1, '2024-01-07 12:00:00', 'Pending', 0);

-- Payment
INSERT INTO payment (req_id, amount, txn_id, payment_status)
VALUES 
(1, 10.00, 'txn12345', 'Completed'),
(2, 15.00, 'txn67890', 'Completed'),
(3, 12.50, 'txn11121', 'Pending');
