use LibraryReservationDB;

-- Assumes Library_Table (18 rows) and Seat (72 rows, 4 per table) already inserted as provi

-- USERS (60 total: user_id 1-5 = Manager, 6-60 = Student)

INSERT INTO Library_Table (positionX, positionY, rotation) VALUES
(50,70,90),
(50,190,90),
(210,70,90),
(210,190,90),
(530,70,90),
(530,190,90),
(690,70,90),
(690,190,90),
(950,130,0),
(320,400,0),
(440,400,0),
(560,400,0),
(680,400,0),
(950,345,90),
(950,465,90),
(190,630,0),
(540,630,0),
(760,630,0);

INSERT INTO Seat (table_id, current_status)
SELECT t.table_id, 'Available'
FROM Library_Table t
CROSS JOIN (
    SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
) AS seat_numbers;

-- Generated seed data for LibraryReservationDB

-- Assumes Library_Table (18 rows) and Seat (72 rows, 4 per table) already inserted as provided



-- USERS (60 total: user_id 1-5 = Manager, 6-60 = Student)

-- Generated seed data for LibraryReservationDB

-- Assumes Library_Table (18 rows) and Seat (72 rows, 4 per table) already inserted as provided



-- USERS (60 total: user_id 1-5 = Manager, 6-60 = Student)

-- Generated seed data for LibraryReservationDB

-- Assumes Library_Table (18 rows) and Seat (72 rows, 4 per table) already inserted as provided



-- USERS (60 total: user_id 1-5 = Manager, 6-60 = Student)

-- Generated seed data for LibraryReservationDB

-- Assumes Library_Table (18 rows) and Seat (72 rows, 4 per table) already inserted as provided



-- USERS (60 total: user_id 1-5 = Manager, 6-60 = Student)

-- Generated seed data for LibraryReservationDB

-- Assumes Library_Table (18 rows) and Seat (72 rows, 4 per table) already inserted as provided


INSERT INTO User (email, password, full_name, role) VALUES
('alice@university.edu', 'pass1', 'Alice Student', 'Student'),
('bob@library.edu', 'pass2', 'Bob Manager', 'Manager');

-- USERS (60 total: user_id 1-5 = Manager, 6-60 = Student)

INSERT INTO User (email, password, full_name, role) VALUES
('mary.harris1@student.edu', '$2b$10$hashPlaceholder001', 'Mary Harris', 'Manager'),
('larry.rodriguez2@student.edu', '$2b$10$hashPlaceholder002', 'Larry Rodriguez', 'Manager'),
('rebecca.anderson3@student.edu', '$2b$10$hashPlaceholder003', 'Rebecca Anderson', 'Manager'),
('eric.martinez4@student.edu', '$2b$10$hashPlaceholder004', 'Eric Martinez', 'Manager'),
('william.jones5@student.edu', '$2b$10$hashPlaceholder005', 'William Jones', 'Manager'),
('stephen.robinson6@student.edu', '$2b$10$hashPlaceholder006', 'Stephen Robinson', 'Student'),
('samantha.hernandez7@student.edu', '$2b$10$hashPlaceholder007', 'Samantha Hernandez', 'Student'),
('amanda.brown8@student.edu', '$2b$10$hashPlaceholder008', 'Amanda Brown', 'Student'),
('eric.green9@student.edu', '$2b$10$hashPlaceholder009', 'Eric Green', 'Student'),
('ryan.king10@student.edu', '$2b$10$hashPlaceholder010', 'Ryan King', 'Student'),
('debra.anderson11@student.edu', '$2b$10$hashPlaceholder011', 'Debra Anderson', 'Student'),
('gary.nguyen12@student.edu', '$2b$10$hashPlaceholder012', 'Gary Nguyen', 'Student'),
('michelle.walker13@student.edu', '$2b$10$hashPlaceholder013', 'Michelle Walker', 'Student'),
('samantha.king14@student.edu', '$2b$10$hashPlaceholder014', 'Samantha King', 'Student'),
('sharon.torres15@student.edu', '$2b$10$hashPlaceholder015', 'Sharon Torres', 'Student'),
('robert.gonzalez16@student.edu', '$2b$10$hashPlaceholder016', 'Robert Gonzalez', 'Student'),
('jonathan.mitchell17@student.edu', '$2b$10$hashPlaceholder017', 'Jonathan Mitchell', 'Student'),
('betty.wilson18@student.edu', '$2b$10$hashPlaceholder018', 'Betty Wilson', 'Student'),
('carol.martin19@student.edu', '$2b$10$hashPlaceholder019', 'Carol Martin', 'Student'),
('dorothy.rivera20@student.edu', '$2b$10$hashPlaceholder020', 'Dorothy Rivera', 'Student'),
('nicholas.hill21@student.edu', '$2b$10$hashPlaceholder021', 'Nicholas Hill', 'Student'),
('andrew.walker22@student.edu', '$2b$10$hashPlaceholder022', 'Andrew Walker', 'Student'),
('scott.torres23@student.edu', '$2b$10$hashPlaceholder023', 'Scott Torres', 'Student'),
('catherine.robinson24@student.edu', '$2b$10$hashPlaceholder024', 'Catherine Robinson', 'Student'),
('amy.taylor25@student.edu', '$2b$10$hashPlaceholder025', 'Amy Taylor', 'Student'),
('samantha.young26@student.edu', '$2b$10$hashPlaceholder026', 'Samantha Young', 'Student'),
('donald.williams27@student.edu', '$2b$10$hashPlaceholder027', 'Donald Williams', 'Student'),
('linda.taylor28@student.edu', '$2b$10$hashPlaceholder028', 'Linda Taylor', 'Student'),
('katherine.wilson29@student.edu', '$2b$10$hashPlaceholder029', 'Katherine Wilson', 'Student'),
('jeffrey.williams30@student.edu', '$2b$10$hashPlaceholder030', 'Jeffrey Williams', 'Student'),
('patrick.lee31@student.edu', '$2b$10$hashPlaceholder031', 'Patrick Lee', 'Student'),
('andrew.wilson32@student.edu', '$2b$10$hashPlaceholder032', 'Andrew Wilson', 'Student'),
('donald.moore33@student.edu', '$2b$10$hashPlaceholder033', 'Donald Moore', 'Student'),
('gary.clark34@student.edu', '$2b$10$hashPlaceholder034', 'Gary Clark', 'Student'),
('emily.rodriguez35@student.edu', '$2b$10$hashPlaceholder035', 'Emily Rodriguez', 'Student'),
('jennifer.clark36@student.edu', '$2b$10$hashPlaceholder036', 'Jennifer Clark', 'Student'),
('richard.nguyen37@student.edu', '$2b$10$hashPlaceholder037', 'Richard Nguyen', 'Student'),
('catherine.green38@student.edu', '$2b$10$hashPlaceholder038', 'Catherine Green', 'Student'),
('brian.martinez39@student.edu', '$2b$10$hashPlaceholder039', 'Brian Martinez', 'Student'),
('rachel.davis40@student.edu', '$2b$10$hashPlaceholder040', 'Rachel Davis', 'Student'),
('thomas.lewis41@student.edu', '$2b$10$hashPlaceholder041', 'Thomas Lewis', 'Student'),
('patrick.torres42@student.edu', '$2b$10$hashPlaceholder042', 'Patrick Torres', 'Student'),
('kevin.lopez43@student.edu', '$2b$10$hashPlaceholder043', 'Kevin Lopez', 'Student'),
('samantha.young44@student.edu', '$2b$10$hashPlaceholder044', 'Samantha Young', 'Student'),
('paul.wilson45@student.edu', '$2b$10$hashPlaceholder045', 'Paul Wilson', 'Student'),
('anthony.williams46@student.edu', '$2b$10$hashPlaceholder046', 'Anthony Williams', 'Student'),
('andrew.anderson47@student.edu', '$2b$10$hashPlaceholder047', 'Andrew Anderson', 'Student'),
('kimberly.clark48@student.edu', '$2b$10$hashPlaceholder048', 'Kimberly Clark', 'Student'),
('jack.mitchell49@student.edu', '$2b$10$hashPlaceholder049', 'Jack Mitchell', 'Student'),
('catherine.martin50@student.edu', '$2b$10$hashPlaceholder050', 'Catherine Martin', 'Student'),
('jonathan.king51@student.edu', '$2b$10$hashPlaceholder051', 'Jonathan King', 'Student'),
('michelle.taylor52@student.edu', '$2b$10$hashPlaceholder052', 'Michelle Taylor', 'Student'),
('margaret.thomas53@student.edu', '$2b$10$hashPlaceholder053', 'Margaret Thomas', 'Student'),
('emma.torres54@student.edu', '$2b$10$hashPlaceholder054', 'Emma Torres', 'Student'),
('katherine.baker55@student.edu', '$2b$10$hashPlaceholder055', 'Katherine Baker', 'Student'),
('melissa.robinson56@student.edu', '$2b$10$hashPlaceholder056', 'Melissa Robinson', 'Student'),
('patricia.torres57@student.edu', '$2b$10$hashPlaceholder057', 'Patricia Torres', 'Student'),
('jeffrey.baker58@student.edu', '$2b$10$hashPlaceholder058', 'Jeffrey Baker', 'Student'),
('elizabeth.rodriguez59@student.edu', '$2b$10$hashPlaceholder059', 'Elizabeth Rodriguez', 'Student'),
('sharon.sanchez60@student.edu', '$2b$10$hashPlaceholder060', 'Sharon Sanchez', 'Student');



-- NOTIFICATIONS (120 total)

INSERT INTO Notification (recipient_id, title, message_body, is_read, created_at) VALUES
(37, 'Seat Released', 'Your seat has been released back to the available pool.', 0, DATE_SUB(NOW(), INTERVAL 54 DAY)),
(8, 'Account Update', 'Your account details were updated successfully.', 1, DATE_SUB(NOW(), INTERVAL 31 DAY)),
(39, 'Seat Released', 'Your seat has been released back to the available pool.', 0, DATE_SUB(NOW(), INTERVAL 69 DAY)),
(56, 'New Feature Available', 'You can now filter seats by table label such as Near Window or Under AC.', 1, DATE_SUB(NOW(), INTERVAL 31 DAY)),
(24, 'Maintenance Notice', 'The library will undergo scheduled maintenance this weekend.', 0, DATE_SUB(NOW(), INTERVAL 58 DAY)),
(41, 'Reservation Reminder', 'Your reservation starts in 15 minutes. Please check in on time.', 1, DATE_SUB(NOW(), INTERVAL 31 DAY)),
(43, 'Reservation Reminder', 'Your reservation starts in 15 minutes. Please check in on time.', 0, DATE_SUB(NOW(), INTERVAL 70 DAY)),
(58, 'Check-in Successful', 'You have successfully checked in to your reserved seat.', 1, DATE_SUB(NOW(), INTERVAL 9 DAY)),
(41, 'Check-in Successful', 'You have successfully checked in to your reserved seat.', 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(55, 'Feedback Received', 'Thank you for submitting your feedback. Our team will review it shortly.', 0, DATE_SUB(NOW(), INTERVAL 46 DAY)),
(1, 'Check-in Successful', 'You have successfully checked in to your reserved seat.', 1, DATE_SUB(NOW(), INTERVAL 70 DAY)),
(11, 'Seat Released', 'Your seat has been released back to the available pool.', 1, DATE_SUB(NOW(), INTERVAL 71 DAY)),
(32, 'Policy Update', 'Library reservation policies have been updated. Please review the new terms.', 0, DATE_SUB(NOW(), INTERVAL 81 DAY)),
(49, 'Seat Released', 'Your seat has been released back to the available pool.', 0, DATE_SUB(NOW(), INTERVAL 0 DAY)),
(56, 'Seat Released', 'Your seat has been released back to the available pool.', 0, DATE_SUB(NOW(), INTERVAL 60 DAY)),
(19, 'Seat Released', 'Your seat has been released back to the available pool.', 1, DATE_SUB(NOW(), INTERVAL 14 DAY)),
(24, 'Policy Update', 'Library reservation policies have been updated. Please review the new terms.', 0, DATE_SUB(NOW(), INTERVAL 23 DAY)),
(22, 'New Feature Available', 'You can now filter seats by table label such as Near Window or Under AC.', 0, DATE_SUB(NOW(), INTERVAL 84 DAY)),
(56, 'Maintenance Notice', 'The library will undergo scheduled maintenance this weekend.', 1, DATE_SUB(NOW(), INTERVAL 62 DAY)),
(51, 'Reservation Confirmed', 'Your seat reservation has been confirmed for your selected time slot.', 0, DATE_SUB(NOW(), INTERVAL 27 DAY)),
(34, 'Account Update', 'Your account details were updated successfully.', 1, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(36, 'Check-in Successful', 'You have successfully checked in to your reserved seat.', 0, DATE_SUB(NOW(), INTERVAL 87 DAY)),
(54, 'Reservation Cancelled', 'Your reservation was cancelled due to no check-in within the grace period.', 1, DATE_SUB(NOW(), INTERVAL 8 DAY)),
(56, 'Account Update', 'Your account details were updated successfully.', 1, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(51, 'Policy Update', 'Library reservation policies have been updated. Please review the new terms.', 0, DATE_SUB(NOW(), INTERVAL 32 DAY)),
(53, 'New Feature Available', 'You can now filter seats by table label such as Near Window or Under AC.', 0, DATE_SUB(NOW(), INTERVAL 12 DAY)),
(48, 'New Feature Available', 'You can now filter seats by table label such as Near Window or Under AC.', 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(34, 'Reservation Cancelled', 'Your reservation was cancelled due to no check-in within the grace period.', 1, DATE_SUB(NOW(), INTERVAL 53 DAY)),
(43, 'Reservation Confirmed', 'Your seat reservation has been confirmed for your selected time slot.', 0, DATE_SUB(NOW(), INTERVAL 71 DAY)),
(29, 'New Feature Available', 'You can now filter seats by table label such as Near Window or Under AC.', 0, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(28, 'Account Update', 'Your account details were updated successfully.', 0, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(59, 'Feedback Received', 'Thank you for submitting your feedback. Our team will review it shortly.', 0, DATE_SUB(NOW(), INTERVAL 22 DAY)),
(4, 'Check-in Successful', 'You have successfully checked in to your reserved seat.', 0, DATE_SUB(NOW(), INTERVAL 53 DAY)),
(55, 'Feedback Received', 'Thank you for submitting your feedback. Our team will review it shortly.', 1, DATE_SUB(NOW(), INTERVAL 10 DAY)),
(13, 'Check-in Successful', 'You have successfully checked in to your reserved seat.', 1, DATE_SUB(NOW(), INTERVAL 72 DAY)),
(1, 'Maintenance Notice', 'The library will undergo scheduled maintenance this weekend.', 0, DATE_SUB(NOW(), INTERVAL 10 DAY)),
(15, 'Maintenance Notice', 'The library will undergo scheduled maintenance this weekend.', 0, DATE_SUB(NOW(), INTERVAL 77 DAY)),
(14, 'Reservation Reminder', 'Your reservation starts in 15 minutes. Please check in on time.', 0, DATE_SUB(NOW(), INTERVAL 61 DAY)),
(28, 'Feedback Received', 'Thank you for submitting your feedback. Our team will review it shortly.', 0, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(45, 'Check-in Successful', 'You have successfully checked in to your reserved seat.', 0, DATE_SUB(NOW(), INTERVAL 66 DAY)),
(16, 'Account Update', 'Your account details were updated successfully.', 0, DATE_SUB(NOW(), INTERVAL 26 DAY)),
(56, 'Reservation Reminder', 'Your reservation starts in 15 minutes. Please check in on time.', 1, DATE_SUB(NOW(), INTERVAL 32 DAY)),
(11, 'Feedback Received', 'Thank you for submitting your feedback. Our team will review it shortly.', 1, DATE_SUB(NOW(), INTERVAL 39 DAY)),
(47, 'Policy Update', 'Library reservation policies have been updated. Please review the new terms.', 0, DATE_SUB(NOW(), INTERVAL 33 DAY)),
(56, 'Reservation Confirmed', 'Your seat reservation has been confirmed for your selected time slot.', 0, DATE_SUB(NOW(), INTERVAL 36 DAY)),
(28, 'Account Update', 'Your account details were updated successfully.', 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(3, 'Maintenance Notice', 'The library will undergo scheduled maintenance this weekend.', 0, DATE_SUB(NOW(), INTERVAL 62 DAY)),
(24, 'Feedback Received', 'Thank you for submitting your feedback. Our team will review it shortly.', 0, DATE_SUB(NOW(), INTERVAL 14 DAY)),
(52, 'Policy Update', 'Library reservation policies have been updated. Please review the new terms.', 1, DATE_SUB(NOW(), INTERVAL 60 DAY)),
(1, 'Reservation Confirmed', 'Your seat reservation has been confirmed for your selected time slot.', 1, DATE_SUB(NOW(), INTERVAL 64 DAY)),
(18, 'Reservation Reminder', 'Your reservation starts in 15 minutes. Please check in on time.', 0, DATE_SUB(NOW(), INTERVAL 76 DAY)),
(52, 'Policy Update', 'Library reservation policies have been updated. Please review the new terms.', 0, DATE_SUB(NOW(), INTERVAL 68 DAY)),
(27, 'New Feature Available', 'You can now filter seats by table label such as Near Window or Under AC.', 1, DATE_SUB(NOW(), INTERVAL 30 DAY)),
(6, 'Seat Released', 'Your seat has been released back to the available pool.', 0, DATE_SUB(NOW(), INTERVAL 39 DAY)),
(27, 'Account Update', 'Your account details were updated successfully.', 1, DATE_SUB(NOW(), INTERVAL 34 DAY)),
(21, 'New Feature Available', 'You can now filter seats by table label such as Near Window or Under AC.', 1, DATE_SUB(NOW(), INTERVAL 62 DAY)),
(47, 'Reservation Reminder', 'Your reservation starts in 15 minutes. Please check in on time.', 1, DATE_SUB(NOW(), INTERVAL 17 DAY)),
(25, 'Reservation Confirmed', 'Your seat reservation has been confirmed for your selected time slot.', 1, DATE_SUB(NOW(), INTERVAL 56 DAY)),
(11, 'Maintenance Notice', 'The library will undergo scheduled maintenance this weekend.', 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(48, 'New Feature Available', 'You can now filter seats by table label such as Near Window or Under AC.', 0, DATE_SUB(NOW(), INTERVAL 18 DAY)),
(44, 'Policy Update', 'Library reservation policies have been updated. Please review the new terms.', 0, DATE_SUB(NOW(), INTERVAL 85 DAY)),
(34, 'Maintenance Notice', 'The library will undergo scheduled maintenance this weekend.', 0, DATE_SUB(NOW(), INTERVAL 85 DAY)),
(8, 'Check-in Successful', 'You have successfully checked in to your reserved seat.', 1, DATE_SUB(NOW(), INTERVAL 81 DAY)),
(43, 'Reservation Reminder', 'Your reservation starts in 15 minutes. Please check in on time.', 1, DATE_SUB(NOW(), INTERVAL 87 DAY)),
(4, 'Reservation Cancelled', 'Your reservation was cancelled due to no check-in within the grace period.', 0, DATE_SUB(NOW(), INTERVAL 44 DAY)),
(24, 'Policy Update', 'Library reservation policies have been updated. Please review the new terms.', 0, DATE_SUB(NOW(), INTERVAL 39 DAY)),
(37, 'Maintenance Notice', 'The library will undergo scheduled maintenance this weekend.', 0, DATE_SUB(NOW(), INTERVAL 64 DAY)),
(40, 'Account Update', 'Your account details were updated successfully.', 1, DATE_SUB(NOW(), INTERVAL 28 DAY)),
(34, 'New Feature Available', 'You can now filter seats by table label such as Near Window or Under AC.', 0, DATE_SUB(NOW(), INTERVAL 82 DAY)),
(27, 'New Feature Available', 'You can now filter seats by table label such as Near Window or Under AC.', 0, DATE_SUB(NOW(), INTERVAL 77 DAY)),
(11, 'New Feature Available', 'You can now filter seats by table label such as Near Window or Under AC.', 0, DATE_SUB(NOW(), INTERVAL 51 DAY)),
(34, 'Reservation Confirmed', 'Your seat reservation has been confirmed for your selected time slot.', 1, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(46, 'Account Update', 'Your account details were updated successfully.', 0, DATE_SUB(NOW(), INTERVAL 32 DAY)),
(18, 'Account Update', 'Your account details were updated successfully.', 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, 'Check-in Successful', 'You have successfully checked in to your reserved seat.', 1, DATE_SUB(NOW(), INTERVAL 66 DAY)),
(46, 'Policy Update', 'Library reservation policies have been updated. Please review the new terms.', 0, DATE_SUB(NOW(), INTERVAL 57 DAY)),
(35, 'Reservation Cancelled', 'Your reservation was cancelled due to no check-in within the grace period.', 1, DATE_SUB(NOW(), INTERVAL 25 DAY)),
(59, 'New Feature Available', 'You can now filter seats by table label such as Near Window or Under AC.', 0, DATE_SUB(NOW(), INTERVAL 8 DAY)),
(20, 'Account Update', 'Your account details were updated successfully.', 1, DATE_SUB(NOW(), INTERVAL 75 DAY)),
(26, 'Reservation Reminder', 'Your reservation starts in 15 minutes. Please check in on time.', 0, DATE_SUB(NOW(), INTERVAL 58 DAY)),
(31, 'Feedback Received', 'Thank you for submitting your feedback. Our team will review it shortly.', 0, DATE_SUB(NOW(), INTERVAL 89 DAY)),
(53, 'Feedback Received', 'Thank you for submitting your feedback. Our team will review it shortly.', 0, DATE_SUB(NOW(), INTERVAL 12 DAY)),
(15, 'Maintenance Notice', 'The library will undergo scheduled maintenance this weekend.', 1, DATE_SUB(NOW(), INTERVAL 43 DAY)),
(52, 'Seat Released', 'Your seat has been released back to the available pool.', 0, DATE_SUB(NOW(), INTERVAL 55 DAY)),
(55, 'Seat Released', 'Your seat has been released back to the available pool.', 0, DATE_SUB(NOW(), INTERVAL 46 DAY)),
(2, 'Policy Update', 'Library reservation policies have been updated. Please review the new terms.', 0, DATE_SUB(NOW(), INTERVAL 51 DAY)),
(34, 'Reservation Cancelled', 'Your reservation was cancelled due to no check-in within the grace period.', 1, DATE_SUB(NOW(), INTERVAL 59 DAY)),
(47, 'Reservation Confirmed', 'Your seat reservation has been confirmed for your selected time slot.', 1, DATE_SUB(NOW(), INTERVAL 85 DAY)),
(31, 'Reservation Confirmed', 'Your seat reservation has been confirmed for your selected time slot.', 0, DATE_SUB(NOW(), INTERVAL 78 DAY)),
(26, 'Seat Released', 'Your seat has been released back to the available pool.', 0, DATE_SUB(NOW(), INTERVAL 14 DAY)),
(49, 'Feedback Received', 'Thank you for submitting your feedback. Our team will review it shortly.', 0, DATE_SUB(NOW(), INTERVAL 34 DAY)),
(28, 'Policy Update', 'Library reservation policies have been updated. Please review the new terms.', 1, DATE_SUB(NOW(), INTERVAL 71 DAY)),
(47, 'Maintenance Notice', 'The library will undergo scheduled maintenance this weekend.', 1, DATE_SUB(NOW(), INTERVAL 9 DAY)),
(41, 'Maintenance Notice', 'The library will undergo scheduled maintenance this weekend.', 0, DATE_SUB(NOW(), INTERVAL 75 DAY)),
(24, 'Policy Update', 'Library reservation policies have been updated. Please review the new terms.', 0, DATE_SUB(NOW(), INTERVAL 29 DAY)),
(35, 'Account Update', 'Your account details were updated successfully.', 1, DATE_SUB(NOW(), INTERVAL 36 DAY)),
(44, 'Reservation Cancelled', 'Your reservation was cancelled due to no check-in within the grace period.', 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(20, 'New Feature Available', 'You can now filter seats by table label such as Near Window or Under AC.', 1, DATE_SUB(NOW(), INTERVAL 34 DAY)),
(16, 'Policy Update', 'Library reservation policies have been updated. Please review the new terms.', 1, DATE_SUB(NOW(), INTERVAL 78 DAY)),
(39, 'Maintenance Notice', 'The library will undergo scheduled maintenance this weekend.', 0, DATE_SUB(NOW(), INTERVAL 30 DAY)),
(44, 'Policy Update', 'Library reservation policies have been updated. Please review the new terms.', 1, DATE_SUB(NOW(), INTERVAL 52 DAY)),
(40, 'Reservation Reminder', 'Your reservation starts in 15 minutes. Please check in on time.', 0, DATE_SUB(NOW(), INTERVAL 9 DAY)),
(56, 'Account Update', 'Your account details were updated successfully.', 1, DATE_SUB(NOW(), INTERVAL 45 DAY)),
(48, 'Reservation Confirmed', 'Your seat reservation has been confirmed for your selected time slot.', 1, DATE_SUB(NOW(), INTERVAL 44 DAY)),
(2, 'Check-in Successful', 'You have successfully checked in to your reserved seat.', 0, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(6, 'Check-in Successful', 'You have successfully checked in to your reserved seat.', 0, DATE_SUB(NOW(), INTERVAL 75 DAY)),
(21, 'Account Update', 'Your account details were updated successfully.', 1, DATE_SUB(NOW(), INTERVAL 55 DAY)),
(10, 'Reservation Cancelled', 'Your reservation was cancelled due to no check-in within the grace period.', 1, DATE_SUB(NOW(), INTERVAL 25 DAY)),
(18, 'Seat Released', 'Your seat has been released back to the available pool.', 1, DATE_SUB(NOW(), INTERVAL 39 DAY)),
(44, 'Account Update', 'Your account details were updated successfully.', 1, DATE_SUB(NOW(), INTERVAL 45 DAY)),
(21, 'New Feature Available', 'You can now filter seats by table label such as Near Window or Under AC.', 0, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(16, 'Reservation Reminder', 'Your reservation starts in 15 minutes. Please check in on time.', 0, DATE_SUB(NOW(), INTERVAL 38 DAY)),
(8, 'New Feature Available', 'You can now filter seats by table label such as Near Window or Under AC.', 0, DATE_SUB(NOW(), INTERVAL 62 DAY)),
(3, 'Policy Update', 'Library reservation policies have been updated. Please review the new terms.', 1, DATE_SUB(NOW(), INTERVAL 78 DAY)),
(38, 'Feedback Received', 'Thank you for submitting your feedback. Our team will review it shortly.', 1, DATE_SUB(NOW(), INTERVAL 40 DAY)),
(56, 'Reservation Cancelled', 'Your reservation was cancelled due to no check-in within the grace period.', 0, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(35, 'New Feature Available', 'You can now filter seats by table label such as Near Window or Under AC.', 0, DATE_SUB(NOW(), INTERVAL 19 DAY)),
(49, 'Account Update', 'Your account details were updated successfully.', 1, DATE_SUB(NOW(), INTERVAL 61 DAY)),
(44, 'Maintenance Notice', 'The library will undergo scheduled maintenance this weekend.', 1, DATE_SUB(NOW(), INTERVAL 22 DAY)),
(33, 'Reservation Confirmed', 'Your seat reservation has been confirmed for your selected time slot.', 0, DATE_SUB(NOW(), INTERVAL 39 DAY));



-- FEEDBACK (80 total, sentiment/confidence generated via sentimentClassifier.js)

INSERT INTO Feedback (user_id, star_rating, comment, sentiment, confidence, created_at) VALUES
(41, 1, 'The printer on the first floor is broken again.', 'Management_issue', 0.458, DATE_SUB(NOW(), INTERVAL 124 DAY)),
(24, 1, 'I can''t log in, the password reset email never arrives.', 'Bug', 0.428, DATE_SUB(NOW(), INTERVAL 174 DAY)),
(28, 1, 'Getting an error when I try to cancel my reservation.', 'Bug', 0.49, DATE_SUB(NOW(), INTERVAL 149 DAY)),
(28, 3, 'Login fails constantly, it says wrong password even when it''s correct.', 'Bug', 0.733, DATE_SUB(NOW(), INTERVAL 119 DAY)),
(46, 2, 'Lights near the window seats keep flickering, kind of annoying.', 'Management_issue', 0.607, DATE_SUB(NOW(), INTERVAL 167 DAY)),
(43, 5, 'I''m really happy with how fast the check-in process is now.', 'General', 0.463, DATE_SUB(NOW(), INTERVAL 32 DAY)),
(33, 2, 'Table near the door is damaged, one leg is completely broken.', 'Management_issue', 0.799, DATE_SUB(NOW(), INTERVAL 108 DAY)),
(24, 3, 'This is the best study space app I''ve used, fantastic job.', 'General', 0.634, DATE_SUB(NOW(), INTERVAL 112 DAY)),
(44, 1, 'Login fails constantly, it says wrong password even when it''s correct.', 'Bug', 0.733, DATE_SUB(NOW(), INTERVAL 91 DAY)),
(46, 3, 'The floor near the restroom smells bad, needs maintenance.', 'Management_issue', 0.54, DATE_SUB(NOW(), INTERVAL 111 DAY)),
(11, 3, 'This is the best study space app I''ve used, fantastic job.', 'General', 0.634, DATE_SUB(NOW(), INTERVAL 0 DAY)),
(50, 3, 'Please consider adding a feature to rate specific seats.', 'Feature_request', 0.775, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(45, 4, 'The notification for check-in reminder never showed up.', 'Feature_request', 0.312, DATE_SUB(NOW(), INTERVAL 40 DAY)),
(8, 3, 'Everything works fine for me, no complaints.', 'General', 0.426, DATE_SUB(NOW(), INTERVAL 159 DAY)),
(16, 2, 'Can you add push notifications for reservation reminders?', 'Feature_request', 0.44, DATE_SUB(NOW(), INTERVAL 29 DAY)),
(31, 1, 'The scanner at the door is glitchy and takes forever to scan.', 'Management_issue', 0.48, DATE_SUB(NOW(), INTERVAL 40 DAY)),
(12, 2, 'It would be great if we could filter seats by outlet availability.', 'Management_issue', 0.339, DATE_SUB(NOW(), INTERVAL 156 DAY)),
(51, 3, 'I wish there was a way to reserve the same seat every week automatically.', 'Feature_request', 0.363, DATE_SUB(NOW(), INTERVAL 158 DAY)),
(27, 2, 'I wish there was a way to reserve the same seat every week automatically.', 'Feature_request', 0.363, DATE_SUB(NOW(), INTERVAL 17 DAY)),
(43, 3, 'The floor near the restroom smells bad, needs maintenance.', 'Management_issue', 0.54, DATE_SUB(NOW(), INTERVAL 103 DAY)),
(59, 2, 'The floor near the restroom smells bad, needs maintenance.', 'Management_issue', 0.54, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(22, 3, 'The staff were super helpful when I had an issue with my reservation.', 'General', 0.373, DATE_SUB(NOW(), INTERVAL 67 DAY)),
(60, 3, 'Overall a decent experience but nothing special.', 'General', 0.55, DATE_SUB(NOW(), INTERVAL 25 DAY)),
(44, 1, 'Login fails constantly, it says wrong password even when it''s correct.', 'Bug', 0.733, DATE_SUB(NOW(), INTERVAL 105 DAY)),
(14, 2, 'Getting an error when I try to cancel my reservation.', 'Bug', 0.49, DATE_SUB(NOW(), INTERVAL 18 DAY)),
(33, 2, 'There''s a leaking pipe near the study tables, please fix it.', 'Management_issue', 0.54, DATE_SUB(NOW(), INTERVAL 64 DAY)),
(20, 3, 'The AC near the window seats is not working, it''s too hot there.', 'Management_issue', 0.503, DATE_SUB(NOW(), INTERVAL 13 DAY)),
(60, 3, 'Please consider adding a feature to rate specific seats.', 'Feature_request', 0.775, DATE_SUB(NOW(), INTERVAL 60 DAY)),
(51, 2, 'Can you add push notifications for reservation reminders?', 'Feature_request', 0.44, DATE_SUB(NOW(), INTERVAL 98 DAY)),
(39, 2, 'The QR scanner at the entrance is damaged and won''t scan my code.', 'Management_issue', 0.584, DATE_SUB(NOW(), INTERVAL 102 DAY)),
(57, 4, 'Terrible experience, the whole system feels slow and clunky.', 'General', 0.513, DATE_SUB(NOW(), INTERVAL 160 DAY)),
(29, 5, 'Great job on the redesign, much more intuitive now.', 'General', 0.5, DATE_SUB(NOW(), INTERVAL 63 DAY)),
(57, 2, 'It''s annoying that I can''t see how many seats are free before logging in.', 'Bug', 0.355, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(29, 2, 'Please consider adding a feature to rate specific seats.', 'Feature_request', 0.775, DATE_SUB(NOW(), INTERVAL 137 DAY)),
(48, 3, 'I wish there was a way to reserve the same seat every week automatically.', 'Feature_request', 0.363, DATE_SUB(NOW(), INTERVAL 106 DAY)),
(41, 3, 'There''s a leaking pipe near the study tables, please fix it.', 'Management_issue', 0.54, DATE_SUB(NOW(), INTERVAL 135 DAY)),
(12, 3, 'The app crashes every time I try to check in to my seat.', 'Bug', 0.484, DATE_SUB(NOW(), INTERVAL 128 DAY)),
(9, 1, 'The AC near the window seats is not working, it''s too hot there.', 'Management_issue', 0.503, DATE_SUB(NOW(), INTERVAL 81 DAY)),
(22, 3, 'The notification for check-in reminder never showed up.', 'Feature_request', 0.312, DATE_SUB(NOW(), INTERVAL 90 DAY)),
(35, 1, 'Table near the door is damaged, one leg is completely broken.', 'Management_issue', 0.799, DATE_SUB(NOW(), INTERVAL 92 DAY)),
(33, 1, 'It would be great if we could filter seats by outlet availability.', 'Management_issue', 0.339, DATE_SUB(NOW(), INTERVAL 127 DAY)),
(34, 4, 'Thanks for such a smooth booking experience, love it.', 'General', 0.776, DATE_SUB(NOW(), INTERVAL 57 DAY)),
(20, 2, 'The page goes blank after I select a seat, very frustrating.', 'Bug', 0.329, DATE_SUB(NOW(), INTERVAL 133 DAY)),
(42, 5, 'Great job on the redesign, much more intuitive now.', 'General', 0.5, DATE_SUB(NOW(), INTERVAL 138 DAY)),
(2, 2, 'The notification for check-in reminder never showed up.', 'Feature_request', 0.312, DATE_SUB(NOW(), INTERVAL 174 DAY)),
(17, 2, 'It would be great if we could filter seats by outlet availability.', 'Management_issue', 0.339, DATE_SUB(NOW(), INTERVAL 45 DAY)),
(20, 1, 'Wifi keeps disconnecting near the tables under AC.', 'Management_issue', 0.528, DATE_SUB(NOW(), INTERVAL 39 DAY)),
(1, 2, 'The notification for check-in reminder never showed up.', 'Feature_request', 0.312, DATE_SUB(NOW(), INTERVAL 86 DAY)),
(31, 2, 'It would be great if we could filter seats by outlet availability.', 'Management_issue', 0.339, DATE_SUB(NOW(), INTERVAL 40 DAY)),
(50, 3, 'The printer on the first floor is broken again.', 'Management_issue', 0.458, DATE_SUB(NOW(), INTERVAL 178 DAY)),
(22, 3, 'It''s annoying that I can''t see how many seats are free before logging in.', 'Bug', 0.355, DATE_SUB(NOW(), INTERVAL 97 DAY)),
(51, 4, 'Terrible experience, the whole system feels slow and clunky.', 'General', 0.513, DATE_SUB(NOW(), INTERVAL 43 DAY)),
(40, 3, 'The notification for check-in reminder never showed up.', 'Feature_request', 0.312, DATE_SUB(NOW(), INTERVAL 116 DAY)),
(48, 3, 'Overall a decent experience but nothing special.', 'General', 0.55, DATE_SUB(NOW(), INTERVAL 9 DAY)),
(46, 3, 'Table near the door is damaged, one leg is completely broken.', 'Management_issue', 0.799, DATE_SUB(NOW(), INTERVAL 60 DAY)),
(1, 5, 'Terrible experience, the whole system feels slow and clunky.', 'General', 0.513, DATE_SUB(NOW(), INTERVAL 142 DAY)),
(31, 4, 'Great job on the redesign, much more intuitive now.', 'General', 0.5, DATE_SUB(NOW(), INTERVAL 133 DAY)),
(7, 5, 'Great job on the redesign, much more intuitive now.', 'General', 0.5, DATE_SUB(NOW(), INTERVAL 118 DAY)),
(33, 2, 'Please consider adding a feature to rate specific seats.', 'Feature_request', 0.775, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1, 2, 'There''s a leaking pipe near the study tables, please fix it.', 'Management_issue', 0.54, DATE_SUB(NOW(), INTERVAL 20 DAY)),
(14, 5, 'Thanks for such a smooth booking experience, love it.', 'General', 0.776, DATE_SUB(NOW(), INTERVAL 106 DAY)),
(21, 2, 'It''s annoying that I can''t see how many seats are free before logging in.', 'Bug', 0.355, DATE_SUB(NOW(), INTERVAL 116 DAY)),
(31, 2, 'The AC near the window seats is not working, it''s too hot there.', 'Management_issue', 0.503, DATE_SUB(NOW(), INTERVAL 25 DAY)),
(2, 3, 'Please consider adding a feature to rate specific seats.', 'Feature_request', 0.775, DATE_SUB(NOW(), INTERVAL 153 DAY)),
(44, 4, 'Please add an option to extend reservation time from the app.', 'Feature_request', 0.572, DATE_SUB(NOW(), INTERVAL 99 DAY)),
(31, 1, 'Login fails constantly, it says wrong password even when it''s correct.', 'Bug', 0.733, DATE_SUB(NOW(), INTERVAL 148 DAY)),
(7, 2, 'Getting an error when I try to cancel my reservation.', 'Bug', 0.49, DATE_SUB(NOW(), INTERVAL 123 DAY)),
(46, 2, 'The chair at table 12 is broken and wobbles a lot.', 'Management_issue', 0.675, DATE_SUB(NOW(), INTERVAL 73 DAY)),
(18, 1, 'Login fails constantly, it says wrong password even when it''s correct.', 'Bug', 0.733, DATE_SUB(NOW(), INTERVAL 49 DAY)),
(35, 3, 'Can you add push notifications for reservation reminders?', 'Feature_request', 0.44, DATE_SUB(NOW(), INTERVAL 115 DAY)),
(59, 4, 'The notification for check-in reminder never showed up.', 'Feature_request', 0.312, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(20, 5, 'Amazing update, the new seat map is so much clearer now.', 'General', 0.44, DATE_SUB(NOW(), INTERVAL 129 DAY)),
(20, 1, 'Table near the door is damaged, one leg is completely broken.', 'Management_issue', 0.799, DATE_SUB(NOW(), INTERVAL 43 DAY)),
(31, 3, 'It would be great if we could filter seats by outlet availability.', 'Management_issue', 0.339, DATE_SUB(NOW(), INTERVAL 85 DAY)),
(15, 3, 'Lights near the window seats keep flickering, kind of annoying.', 'Management_issue', 0.607, DATE_SUB(NOW(), INTERVAL 69 DAY)),
(53, 2, 'I suggest adding an option to invite friends to reserve nearby seats.', 'Feature_request', 0.631, DATE_SUB(NOW(), INTERVAL 168 DAY)),
(7, 4, 'I suggest adding an option to invite friends to reserve nearby seats.', 'Feature_request', 0.631, DATE_SUB(NOW(), INTERVAL 29 DAY)),
(60, 3, 'Terrible experience, the whole system feels slow and clunky.', 'General', 0.513, DATE_SUB(NOW(), INTERVAL 65 DAY)),
(18, 2, 'The printer on the first floor is broken again.', 'Management_issue', 0.458, DATE_SUB(NOW(), INTERVAL 44 DAY)),
(13, 4, 'Everything works fine for me, no complaints.', 'General', 0.426, DATE_SUB(NOW(), INTERVAL 15 DAY));



-- RESERVATION_RECORD
-- Split into two inserts:
--  1) Historical (Inactive) rows: seat/user chosen independently at random, duplicates OK
--  2) Active/Pending rows: seats picked WITHOUT replacement so no seat is double-booked

-- 1) Historical Inactive reservations (INSERT...SELECT — subqueries are not
-- reliably supported inside a VALUES() row list across MySQL/MariaDB versions,
-- so we generate 115 rows via a derived numbers table instead)
INSERT INTO Reservation_Record 
    (user_id, seat_id, reservation_date, start_time, check_in_time, end_time, outcome) 
VALUES 
    -- === PAST RESERVATIONS (Inactive) ===
    (2, 5, '2026-07-10 09:00:00', '2026-07-11 09:00:00', '2026-07-11 08:58:00', '2026-07-11 12:00:00', 'Inactive'),
    (3, 12, '2026-07-11 14:00:00', '2026-07-12 10:00:00', '2026-07-12 10:05:00', '2026-07-12 16:00:00', 'Inactive'),
    (5, 24, '2026-07-12 08:30:00', '2026-07-12 13:00:00', '2026-07-12 12:55:00', '2026-07-12 15:00:00', 'Inactive'),
    (7, 40, '2026-07-12 19:15:00', '2026-07-13 08:00:00', '2026-07-13 08:00:00', '2026-07-13 17:00:00', 'Inactive'),
    (11, 1, '2026-07-13 11:00:00', '2026-07-13 14:00:00', '2026-07-13 14:10:00', '2026-07-13 18:00:00', 'Inactive'),
    (14, 62, '2026-07-13 15:45:00', '2026-07-14 09:00:00', '2026-07-14 08:50:00', '2026-07-14 13:00:00', 'Inactive'),
    (18, 33, '2026-07-14 10:20:00', '2026-07-14 14:00:00', '2026-07-14 14:02:00', '2026-07-14 16:30:00', 'Inactive'),
    (22, 19, '2026-07-14 08:00:00', '2026-07-15 09:00:00', '2026-07-15 08:55:00', '2026-07-15 17:00:00', 'Inactive'),
    (30, 71, '2026-07-14 16:00:00', '2026-07-15 10:00:00', '2026-07-15 10:01:00', '2026-07-15 12:00:00', 'Inactive'),
    (25, 15, '2026-07-15 09:30:00', '2026-07-15 13:00:00', '2026-07-15 12:50:00', '2026-07-15 18:00:00', 'Inactive'),
    (2, 45, '2026-07-15 11:15:00', '2026-07-16 08:00:00', '2026-07-16 08:05:00', '2026-07-16 12:00:00', 'Inactive'),
    (9, 28, '2026-07-15 14:00:00', '2026-07-16 09:00:00', '2026-07-16 08:45:00', '2026-07-16 17:00:00', 'Inactive'),
    (15, 50, '2026-07-15 17:20:00', '2026-07-16 13:00:00', '2026-07-16 13:00:00', '2026-07-16 15:00:00', 'Inactive'),
    (21, 66, '2026-07-16 08:10:00', '2026-07-16 14:00:00', '2026-07-16 14:15:00', '2026-07-16 19:00:00', 'Inactive'),
    (27, 4, '2026-07-16 10:00:00', '2026-07-17 08:00:00', '2026-07-17 07:55:00', '2026-07-17 11:00:00', 'Inactive'),
    (4, 38, '2026-07-16 12:30:00', '2026-07-17 09:00:00', '2026-07-17 09:00:00', '2026-07-17 12:00:00', 'Inactive'),
    (8, 55, '2026-07-16 13:45:00', '2026-07-17 09:30:00', '2026-07-17 09:40:00', '2026-07-17 12:30:00', 'Inactive'),
    (19, 21, '2026-07-16 15:00:00', '2026-07-17 10:00:00', '2026-07-17 09:59:00', '2026-07-17 13:00:00', 'Inactive'),
    (26, 9, '2026-07-17 07:30:00', '2026-07-17 08:30:00', '2026-07-17 08:25:00', '2026-07-17 10:30:00', 'Inactive'),
    (13, 17, '2026-07-17 08:00:00', '2026-07-17 09:00:00', '2026-07-17 09:02:00', '2026-07-17 12:00:00', 'Inactive'),

    -- === CURRENTLY ACTIVE RESERVATIONS (Active) ===
    (6, 31, '2026-07-16 16:30:00', '2026-07-17 08:00:00', '2026-07-17 07:58:00', '2026-07-17 16:00:00', 'Active'),
    (12, 44, '2026-07-17 08:15:00', '2026-07-17 09:00:00', '2026-07-17 08:55:00', '2026-07-17 17:00:00', 'Active'),
    (17, 2, '2026-07-17 09:00:00', '2026-07-17 10:00:00', '2026-07-17 10:02:00', '2026-07-17 15:00:00', 'Active'),
    (23, 58, '2026-07-17 09:45:00', '2026-07-17 11:00:00', '2026-07-17 10:50:00', '2026-07-17 14:00:00', 'Active'),
    (29, 70, '2026-07-17 10:30:00', '2026-07-17 12:00:00', '2026-07-17 11:58:00', '2026-07-17 18:00:00', 'Active'),
    (10, 13, '2026-07-17 11:00:00', '2026-07-17 12:30:00', '2026-07-17 12:35:00', '2026-07-17 16:30:00', 'Active'),

    -- === FUTURE RESERVATIONS (Pending) ===
    (16, 36, '2026-07-17 08:45:00', '2026-07-17 14:00:00', NULL, '2026-07-17 17:00:00', 'Pending'),
    (20, 48, '2026-07-17 09:15:00', '2026-07-17 15:00:00', NULL, '2026-07-17 19:00:00', 'Pending'),
    (24, 60, '2026-07-17 10:00:00', '2026-07-17 16:00:00', NULL, '2026-07-17 21:00:00', 'Pending'),
    (28, 6, '2026-07-17 11:30:00', '2026-07-17 17:00:00', NULL, '2026-07-17 20:00:00', 'Pending'),
    (3, 22, '2026-07-16 14:00:00', '2026-07-18 08:00:00', NULL, '2026-07-18 12:00:00', 'Pending'),
    (8, 51, '2026-07-17 07:00:00', '2026-07-18 09:00:00', NULL, '2026-07-18 17:00:00', 'Pending'),
    (14, 65, '2026-07-17 08:30:00', '2026-07-18 10:00:00', NULL, '2026-07-18 14:00:00', 'Pending'),
    (19, 10, '2026-07-17 09:40:00', '2026-07-18 13:00:00', NULL, '2026-07-18 16:00:00', 'Pending'),
    (25, 30, '2026-07-17 10:15:00', '2026-07-18 15:00:00', NULL, '2026-07-18 18:00:00', 'Pending'),
    (2, 42, '2026-07-17 11:00:00', '2026-07-19 09:00:00', NULL, '2026-07-19 13:00:00', 'Pending'),
    (9, 56, '2026-07-16 10:00:00', '2026-07-19 14:00:00', NULL, '2026-07-19 18:00:00', 'Pending'),
    (15, 68, '2026-07-17 12:00:00', '2026-07-20 09:00:00', NULL, '2026-07-20 17:00:00', 'Pending'),
    (21, 14, '2026-07-17 12:30:00', '2026-07-21 10:00:00', NULL, '2026-07-21 15:00:00', 'Pending'),
    (30, 26, '2026-07-17 12:45:00', '2026-07-22 08:00:00', NULL, '2026-07-22 12:00:00', 'Pending');


-- SYNC Seat.current_status to match the Active/Pending reservations just inserted

-- (run this AFTER the Reservation_Record insert above)

UPDATE Seat s
LEFT JOIN (
    SELECT seat_id FROM Reservation_Record WHERE outcome IN ('Active', 'Pending')
) occ ON occ.seat_id = s.seat_id
SET s.current_status = CASE
    WHEN occ.seat_id IS NOT NULL THEN 'Occupied'
    WHEN s.current_status = 'Blocked' THEN 'Blocked'
    ELSE 'Available'
END;


/* =====================================================
   DATABASE PERFORMANCE TUNING - INDEXES
   ===================================================== */
-- User
CREATE INDEX idx_user_email
ON User(email);

-- Seat
CREATE INDEX idx_seat_status
ON Seat(current_status);

-- Reservation_Record
CREATE INDEX idx_reservation_user_outcome
ON Reservation_Record(user_id, outcome);

CREATE INDEX idx_reservation_outcome_start
ON Reservation_Record(outcome, start_time);

CREATE INDEX idx_reservation_date
ON Reservation_Record(reservation_date);

-- Feedback
CREATE INDEX idx_feedback_sentiment
ON Feedback(sentiment);

-- Notification
CREATE INDEX idx_notification_recipient_read
ON Notification(recipient_id, is_read);
