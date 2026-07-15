-- 1. Ensure a clean state
USE LibraryReservationDB;

-- 2. CREATE TABLEs (Paste your original CREATE statements here)
-- ... [Your CREATE TABLE statements go here] ...

-- 3. Now insert the data in strict order
-- A. Add Users

INSERT INTO User (email, password, full_name, role) VALUES 
('alice@university.edu', 'pass1', 'Alice Student', 'Student'),
('bob@library.edu', 'pass2', 'Bob Manager', 'Manager');


-- B. Add Student Profile (Referencing Alice, who is ID 1)
INSERT INTO Student_Profile (user_id, current_penalty_score) VALUES (1, 100);

-- C. Add Tables and Seats
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

-- D. Add remaining items

INSERT INTO Penalty_Record (user_id, violation_type, timestamp) VALUES 
(1, 'Late Cancellation', NOW());

-- 6. Insert Notification
INSERT INTO Notification (recipient_id, title, message_body) VALUES 
(1, 'Reservation Reminder', 'Your booking is tomorrow at 9:00 AM.');

-- 7. Insert Audit Lo

-- 8. Insert Active Reservation (Dependent on User 1 and Seat 1)
-- 9. Insert History Log


select * from library_table;
select * from seat;
select * from feedback;