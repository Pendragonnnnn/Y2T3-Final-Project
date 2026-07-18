USE LibraryReservationDB;

CREATE ROLE IF NOT EXISTS 'app_backend';
CREATE ROLE IF NOT EXISTS 'db_admin';
CREATE ROLE IF NOT EXISTS 'read_only_analyst';
CREATE ROLE IF NOT EXISTS 'backup_user';

-- ── app_backend ──────────────────────────────────────────────────────────
GRANT SELECT, INSERT, UPDATE, DELETE 
    ON LibraryReservationDB.User 
    TO 'app_backend';

GRANT SELECT, INSERT, UPDATE, DELETE 
    ON LibraryReservationDB.Seat 
    TO 'app_backend';

GRANT SELECT, INSERT, UPDATE, DELETE 
    ON LibraryReservationDB.Reservation_Record 
    TO 'app_backend';

GRANT SELECT, INSERT, UPDATE, DELETE 
    ON LibraryReservationDB.Notification 
    TO 'app_backend';

GRANT SELECT, INSERT, UPDATE, DELETE 
    ON LibraryReservationDB.Feedback 
    TO 'app_backend';

-- Library_Table is mostly read-only for the backend (manager sets up tables once)
GRANT SELECT, UPDATE
    ON LibraryReservationDB.Library_Table 
    TO 'app_backend';

-- Note: No DELETE on Feedback — feedback should be permanent records
-- Note: No DROP, ALTER, CREATE — backend should never modify schema

-- ── db_admin ──────────────────────────────────────────────────────────────

GRANT ALL PRIVILEGES 
    ON LibraryReservationDB.* 
    TO 'db_admin' WITH GRANT OPTION;

-- ── read_only_analyst ─────────────────────────────────────────────────────
-- Can run reports and analytics queries but cannot modify anything.
-- Notice: password and password_hashed columns are intentionally excluded.

GRANT SELECT (user_id, email, full_name, role)
    ON LibraryReservationDB.User
    TO 'read_only_analyst';

GRANT SELECT 
    ON LibraryReservationDB.Reservation_Record 
    TO 'read_only_analyst';

GRANT SELECT (feedback_id, user_id, star_rating, comment, sentiment, confidence, created_at)
    ON LibraryReservationDB.Feedback 
    TO 'read_only_analyst';

GRANT SELECT 
    ON LibraryReservationDB.Seat 
    TO 'read_only_analyst';

GRANT SELECT 
    ON LibraryReservationDB.Library_Table 
    TO 'read_only_analyst';

-- No access to Notification — those are private messages between the system and students

-- ── backup_user ───────────────────────────────────────────────────────────
-- Automated nightly backup service. Can only read and lock tables for safe export.

GRANT SELECT, LOCK TABLES, SHOW VIEW, TRIGGER, EVENT 
    ON LibraryReservationDB.* 
    TO 'backup_user';

-- =========================================================================
-- STEP 3: CREATE ACTUAL MYSQL USERS AND ASSIGN ROLES
-- =========================================================================

-- Backend application user (used in your .env file)
CREATE USER IF NOT EXISTS 'backend_user'@'localhost' 
    IDENTIFIED BY 'StrongBackendPass123!';
GRANT 'app_backend' TO 'backend_user'@'localhost';
SET DEFAULT ROLE 'app_backend' TO 'backend_user'@'localhost';

-- Database administrator (IT department only)
CREATE USER IF NOT EXISTS 'admin_user'@'localhost' 
    IDENTIFIED BY 'StrongAdminPass456!';
GRANT 'db_admin' TO 'admin_user'@'localhost';
SET DEFAULT ROLE 'db_admin' TO 'admin_user'@'localhost';

-- Analytics/reporting user
CREATE USER IF NOT EXISTS 'analyst_user'@'localhost' 
    IDENTIFIED BY 'StrongAnalystPass789!';
GRANT 'read_only_analyst' TO 'analyst_user'@'localhost';
SET DEFAULT ROLE 'read_only_analyst' TO 'analyst_user'@'localhost';

-- Automated backup service user
CREATE USER IF NOT EXISTS 'backup_service'@'localhost' 
    IDENTIFIED BY 'StrongBackupPass321!';
GRANT 'backup_user' TO 'backup_service'@'localhost';
SET DEFAULT ROLE 'backup_user' TO 'backup_service'@'localhost';

-- =========================================================================
-- STEP 4: APPLY CHANGES
-- =========================================================================

FLUSH PRIVILEGES;

-- =========================================================================
-- VERIFY: Check roles were created correctly
-- =========================================================================

-- Run these to confirm everything looks right:
-- SHOW GRANTS FOR 'app_backend';
-- SHOW GRANTS FOR 'backend_user'@'localhost';
-- SHOW GRANTS FOR 'read_only_analyst';
-- SHOW GRANTS FOR 'analyst_user'@'localhost';