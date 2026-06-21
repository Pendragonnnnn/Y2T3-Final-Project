-- Smart Library Seat Reservation System
-- Database Schema (3NF) — MySQL 8+

DROP DATABASE IF EXISTS LibraryReservationDB;
CREATE DATABASE IF NOT EXISTS LibraryReservationDB;
USE LibraryReservationDB;

-- ── Core user table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user (
  user_id       INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(100) NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,
  full_name     VARCHAR(100) NOT NULL,
  role          ENUM('Student', 'Manager', 'Admin') NOT NULL,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── Student-specific profile (extends user) ─────────────────────
CREATE TABLE IF NOT EXISTS student_profile (
  user_id              INT PRIMARY KEY,
  current_penalty_score INT NOT NULL DEFAULT 100,
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- ── Library tables (clusters of seats) ──────────────────────────
CREATE TABLE IF NOT EXISTS library_table (
  table_id    INT AUTO_INCREMENT PRIMARY KEY,
  table_label ENUM('Near Outlet', 'Near Window', 'Under AC') NOT NULL
);

-- ── Seats ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seat (
  seat_id        INT AUTO_INCREMENT PRIMARY KEY,
  table_id       INT NOT NULL,
  current_status ENUM('Available', 'Occupied', 'Blocked') NOT NULL DEFAULT 'Available',
  FOREIGN KEY (table_id) REFERENCES library_table(table_id) ON DELETE CASCADE
);

-- ── Active (in-progress) reservations ───────────────────────────
CREATE TABLE IF NOT EXISTS active_reservation (
  reservation_id   INT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT NOT NULL,
  seat_id          INT NOT NULL,
  scheduled_start  DATETIME NOT NULL,
  actual_check_in  DATETIME NULL,
  status           ENUM('Pending', 'Active') NOT NULL DEFAULT 'Pending',
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  FOREIGN KEY (seat_id) REFERENCES seat(seat_id) ON DELETE CASCADE
);

-- ── Archived / completed reservation history ────────────────────
CREATE TABLE IF NOT EXISTS reservation_history (
  history_id       INT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT NOT NULL,
  seat_id          INT NOT NULL,
  reservation_date DATETIME NOT NULL,
  end_time         DATETIME NOT NULL,
  outcome          ENUM('Completed', 'Cancelled', 'No-Show') NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  FOREIGN KEY (seat_id) REFERENCES seat(seat_id) ON DELETE CASCADE
);

-- ── Penalty records ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS penalty_record (
  penalty_id     INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT NOT NULL,
  violation_type VARCHAR(50) NOT NULL,
  timestamp      DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- ── Notifications ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notification (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  recipient_id     INT NOT NULL,
  title            VARCHAR(100) NOT NULL,
  message_body     TEXT NOT NULL,
  is_read          BOOLEAN DEFAULT FALSE,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recipient_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- ── Feedback (rating + comment, classified by Logistic Regression) ─
CREATE TABLE IF NOT EXISTS feedback (
  feedback_id   INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  reservation_id INT NULL,
  star_rating   TINYINT NOT NULL,
  comment       TEXT NULL,
  sentiment     ENUM('frustrated', 'neutral', 'satisfied') NULL,
  confidence    FLOAT NULL,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- ── Seed data ─────────────────────────────────────────────────────
INSERT INTO library_table (table_label) VALUES ('Near Outlet'), ('Near Window'), ('Under AC');

INSERT INTO seat (table_id, current_status) VALUES
(1, 'Available'), (1, 'Available'), (1, 'Available'), (1, 'Available'),
(2, 'Available'), (2, 'Occupied'),  (2, 'Available'), (2, 'Available'),
(3, 'Available'), (3, 'Available'), (3, 'Blocked'),   (3, 'Available');
