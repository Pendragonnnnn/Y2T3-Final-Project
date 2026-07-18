-- Create the Database (Optional)
drop database if exists LibraryReservationDB;
CREATE DATABASE IF NOT EXISTS LibraryReservationDB;
USE LibraryReservationDB;

CREATE TABLE User (
    user_id INT AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('Student', 'Manager', 'Guest') NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE Library_Table (
    table_id INT AUTO_INCREMENT,
    table_label ENUM( 'Near Window', 'Under AC'),
    positionX INT,
    positionY INT,
    rotation int,
    PRIMARY KEY (table_id)
);

CREATE TABLE Notification (
    notification_id INT AUTO_INCREMENT,
    recipient_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    message_body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (notification_id),
    FOREIGN KEY (recipient_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE Seat (
    seat_id INT AUTO_INCREMENT,
    table_id INT NOT NULL,
    current_status ENUM('Available', 'Occupied', 'Blocked') DEFAULT 'Available',
    PRIMARY KEY (seat_id),
    FOREIGN KEY (table_id) REFERENCES Library_Table(table_id) ON DELETE CASCADE
);

CREATE TABLE Feedback (
	feedback_id INT AUTO_INCREMENT,
	user_id INT,
	star_rating INT,
	comment TEXT(65535),
	sentiment ENUM('Bug', 'Feature_request', 'Management_issue', 'General'),
	confidence FLOAT,
	created_at DATETIME,
	PRIMARY KEY (feedback_id),
	FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

	CREATE TABLE Reservation_Record (	
	    reservation_id INT AUTO_INCREMENT,
	    user_id INT NOT NULL,
	    seat_id INT NOT NULL,
	    reservation_date DATETIME NOT NULL,
	    start_time DATETIME,
	    check_in_time DATETIME,
	    end_time DATETIME,
	    outcome ENUM('Inactive', 'Pending', 'Active') NOT NULL,
	    PRIMARY KEY (reservation_id),
	    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
	    FOREIGN KEY (seat_id) REFERENCES Seat(seat_id) ON DELETE CASCADE
	);
	
	select * from seat;
	select * from reservation_record;