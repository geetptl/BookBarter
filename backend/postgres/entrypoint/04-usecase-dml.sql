-- Users
INSERT INTO users (user_id, password_hash, email, first_name, last_name)
VALUES 
('user1', 'hashed_pass1', 'user1@email.com', 'User', 'One'),
('user2', 'hashed_pass2', 'user2@email.com', 'User', 'Two'),
('user3', 'hashed_pass3', 'user3@email.com', 'User', 'Three'),
('user4', 'hashed_pass4', 'user4@email.com', 'User', 'Four');


-- BookListing
INSERT INTO book_listing (owner_id, book_id, status, status_code)
VALUES 
(1, 1, 'Available', 1),
(1, 2, 'Available', 1),
(2, 3, 'Available', 1),
(2, 4, 'Available', 1),
(3, 5, 'Available', 1),
(3, 6, 'Available', 1),
(4, 7, 'Available', 1),
(4, 8, 'Available', 1);


-- Request
INSERT INTO request (borrower_id, lender_id, book_listing_id, time_to_live, borrow_duration, status)
VALUES 
(1, 2, 3, '2024-01-05 12:00:00', 4, 'Pending'),
-- (2, 1, 2, '2024-01-07 12:00:00', 'Pending'),
(1, 3, 5, '2024-01-07 12:00:00', 3, 'Accepted'),
(1, 3, 6, '2024-01-07 12:00:00', 5, 'Accepted'),
(1, 4, 7, '2024-01-07 12:00:00', 9, 'Rejected'),
(2, 4, 8, '2024-01-06 12:00:00', 6, 'Pending'), 
(4, 1, 1, '2024-01-07 12:00:00', 7, 'Pending');



-- Payment
INSERT INTO payment (req_id, amount, txn_id, payment_status)
VALUES 
(1, 10.00, 'txn12345', 'Completed'),
(2, 15.00, 'txn67890', 'Completed'),
(3, 12.50, 'txn11121', 'Pending');