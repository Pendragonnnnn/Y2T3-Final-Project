/**
 * Seeds initial demo accounts.
 * Run with: npm run seed
 */
const bcrypt = require('bcryptjs');
const db = require('../src/config/db');

async function ensureLibraryTable(label) {
  const [rows] = await db.query('SELECT table_id FROM library_table WHERE table_label = ?', [label]);
  if (rows.length > 0) return rows[0].table_id;

  const [result] = await db.query('INSERT INTO library_table (table_label) VALUES (?)', [label]);
  return result.insertId;
}

async function seed() {
  const password = await bcrypt.hash('password123', 12);

  const tableIds = {
    'Near Outlet': await ensureLibraryTable('Near Outlet'),
    'Near Window': await ensureLibraryTable('Near Window'),
    'Under AC': await ensureLibraryTable('Under AC'),
  };

  const [seatCountRows] = await db.query('SELECT COUNT(*) AS count FROM seat');
  if (seatCountRows[0].count === 0) {
    const seatRows = [
      [tableIds['Near Outlet'], 'Available'], [tableIds['Near Outlet'], 'Available'], [tableIds['Near Outlet'], 'Available'], [tableIds['Near Outlet'], 'Available'],
      [tableIds['Near Window'], 'Available'], [tableIds['Near Window'], 'Occupied'], [tableIds['Near Window'], 'Available'], [tableIds['Near Window'], 'Available'],
      [tableIds['Under AC'], 'Available'], [tableIds['Under AC'], 'Available'], [tableIds['Under AC'], 'Blocked'], [tableIds['Under AC'], 'Available'],
    ];

    await db.query('INSERT INTO seat (table_id, current_status) VALUES ?', [seatRows]);
  }

  const accounts = [
    { email: 'manager@library.edu', fullName: 'Library Manager', role: 'Manager' },
    { email: 'miguel@student.edu', fullName: 'Miguel Santos', role: 'Student' },
    { email: 'alice@student.edu', fullName: 'Alice Tan', role: 'Student' },
  ];

  for (const acc of accounts) {
    const [existing] = await db.query('SELECT user_id FROM user WHERE email = ?', [acc.email]);
    if (existing.length > 0) {
      console.log(`Skipping ${acc.email} (already exists)`);
      continue;
    }
    const [result] = await db.query(
      'INSERT INTO user (email, password, full_name, role) VALUES (?, ?, ?, ?)',
      [acc.email, password, acc.fullName, acc.role]
    );
    if (acc.role === 'Student') {
      await db.query(
        'INSERT INTO student_profile (user_id, current_penalty_score) VALUES (?, 100)',
        [result.insertId]
      );
    }
    console.log(`Created ${acc.role}: ${acc.email} (password: password123)`);
  }

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
