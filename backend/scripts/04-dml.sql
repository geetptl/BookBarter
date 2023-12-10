INSERT INTO users (user_id, password_hash, email, phone_number, address, first_name, last_name, latitude, longitude, is_admin)
VALUES 
('lisa123', '$2b$10$L3OTZL1SnqGVxyVnnM6sduV13GZfe0iG71xCWR.jrHM85VEQMcmE6', 'lisa.kudrow@gmail.com', '1234567890', '11 Madison Avenue, New York, NY, USA', 'Lisa', 'Kudrow', '40.7416112', '-73.9871907', 0),
('bob123', '$2b$10$L3OTZL1SnqGVxyVnnM6sduV13GZfe0iG71xCWR.jrHM85VEQMcmE6', 'bob.builder@gmail.com', '0987654321', '1230 Hamilton Street, Somerset, NJ, USA', 'Bob', 'Builder', '40.486981', '-74.499235', 0),
('dave123', '$2b$10$GqrpSzSwtOD8hM3kKkT38uU0bXalw5C5J5cwEs4KWwud0hwfp12Na', 'Dave.williams@gmail.com', '3456789012', '320 Raritan Avenue, Highland Park, NJ, USA', 'Dave', 'Williams', '40.4992043', '-74.4269702', 0),
('ulrich123', '$2b$10$vj9YqMTOn4XH1..kTTSmiO8Oz5z3GqC8RHwUGgyjDU2CD.U4tcl92', 'ulrich.and@gmail.com', '4567890123', '68 Causeway Street, South River, NJ, USA', 'Ulrich', 'Anderson', '40.4527871', '-74.3730885', 0),
('soph123', '$2b$10$z1yedUmU3lmY2cYdGawN.eWvIQpDZftxZTjN35PqAJQGdy/I1h5CG', 'sophie.miles@gmail.com', '6789012345', '86 Highland Avenue, Somerset, NJ, USA', 'Sophie', 'Mills', '40.4976402', '-74.4692724', 0),
('hope123', '$2b$10$c2THw.ponqYcDMBx8JH3Y.NTfS5s.6mo.tEx1a6.nF6EJ3fNHg5S6', 'hope.lee@gmail.com', '0981234567', '21 Kilmer Road, Edison, NJ, USA', 'Hope', 'Lee', '40.519509', '-74.4214185', 0),
('admin', '$2b$10$zGfnp5l/6G1UU9YB/jXUS.9LfExYqkqru21F2gJvSqExvap.0/SjS', 'admin.user@gmail.com', '2314560987', '5th Avenue, New York, NY, USA', 'admin', 'admin', '40.7744146', '-73.9656177', 1);

INSERT INTO book_listing (owner_id, book_id, status)
VALUES 
(1, 1, 'Not_Available'),
(2, 2, 'Available'),
(3, 3, 'Not_Available'),
(4, 4, 'Not_Available'),
(5, 5, 'Available'),
(6, 6, 'Not_Available'),
(1, 2, 'Available'),
(2, 4, 'Available'),
(2, 5, 'Not_Available');

INSERT INTO request (borrower_id, lender_id, book_listing_id, time_to_live, borrow_duration, status)
VALUES 
(2, 3, 3, '2024-02-10 12:00:00', 14, 'Accepted'),
(2, 2, 2, '2024-02-10 12:00:00', 14, 'Rejected'),
(2, 4, 4, '2024-04-07 12:00:00', 11, 'Accepted'),
(2, 6, 6, '2024-04-07 12:00:00', 11, 'Pending'),
(3, 1, 1, '2024-02-10 12:00:00', 14, 'Pending');


