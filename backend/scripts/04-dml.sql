INSERT INTO users (user_id, password_hash, email, phone_number, address, first_name, last_name, latitude, longitude)
VALUES 
('lisa', '$2b$10$L3OTZL1SnqGVxyVnnM6sduV13GZfe0iG71xCWR.jrHM85VEQMcmE6', 'lisa.kudrow@gmail.com', '1234567890', '11 Madison Avenue, New York, NY, USA', 'Lisa', 'Kudrow', '40.7416112', '-73.9871907'),
('bob123', '$2b$10$L3OTZL1SnqGVxyVnnM6sduV13GZfe0iG71xCWR.jrHM85VEQMcmE6', 'bob.builder@gmail.com', '0987654321', '1230 Hamilton Street, Somerset, NJ, USA', 'Bob', 'Builder', '40.486981', '-74.499235'),
('dave123', '$2b$10$GqrpSzSwtOD8hM3kKkT38uU0bXalw5C5J5cwEs4KWwud0hwfp12Na', 'Dave.williams@gmail.com', '3456789012', '320 Raritan Avenue, Highland Park, NJ, USA', 'Dave', 'Williams', '40.4992043', '-74.4269702'),
('ulrich123', '$2b$10$vj9YqMTOn4XH1..kTTSmiO8Oz5z3GqC8RHwUGgyjDU2CD.U4tcl92', 'ulrich.and@gmail.com', '4567890123', '68 Causeway Street, South River, NJ, USA', 'Ulrich', 'Anderson', '40.4527871', '-74.3730885'),
('soph123', '$2b$10$z1yedUmU3lmY2cYdGawN.eWvIQpDZftxZTjN35PqAJQGdy/I1h5CG', 'sophie.miles@gmail.com', '6789012345', '86 Highland Avenue, Somerset, NJ, USA', 'Sophie', 'Mills', '40.4976402', '-74.4692724'),
('hope123', '$2b$10$c2THw.ponqYcDMBx8JH3Y.NTfS5s.6mo.tEx1a6.nF6EJ3fNHg5S6', 'hope.lee@gmail.com', '0981234567', '21 Kilmer Road, Edison, NJ, USA', 'Hope', 'Lee', '40.519509', '-74.4214185'),
('admin', '$2b$10$zGfnp5l/6G1UU9YB/jXUS.9LfExYqkqru21F2gJvSqExvap.0/SjS', 'admin.user@gmail.com', '2314560987', '5th Avenue, New York, NY, USA', 'admin', 'admin', '40.7744146', '-73.9656177');

INSERT INTO book_listing (owner_id, book_id, status)
VALUES 
(1, 1, 'Available'),
(1, 2, 'Available'),
(1, 3, 'Available'),
(1, 4, 'Available'),
(1, 5, 'Available'),
(2, 6, 'Available'),
(2, 7, 'Available'),
(2, 8, 'Available'),
(2, 9, 'Available'),
(3, 11, 'Available'),
(3, 23, 'Available'),
(3, 1, 'Available'),
(3, 4, 'Available'),
(4, 1, 'Available'),
(4, 3, 'Available'),
(4, 6, 'Available'),
(4, 2, 'Available'),
(5, 1, 'Available'),
(5, 3, 'Available'),
(5, 6, 'Available'),
(5, 2, 'Available');


