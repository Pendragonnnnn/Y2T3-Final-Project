const jwt = require('jsonwebtoken');
const User = require('../models/User');
const db = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

function normalizeRole(role) {
  return typeof role === 'string' ? role.toLowerCase() : 'student';
}

function toDbRole(role) {
  const normalized = normalizeRole(role);
  if (normalized === 'manager') return 'Manager';
  if (normalized === 'admin') return 'Admin';
  return 'Student';
}

exports.register = async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'email, password, and fullName are required' });
    }
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    const apiRole = normalizeRole(role);
    const userId = await User.create({
      email,
      password,
      fullName,
      role: toDbRole(apiRole),
    });

    const token = jwt.sign({ userId, email, role: apiRole }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { userId, email, fullName, role: apiRole } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: normalizeRole(user.role) },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { userId: user.user_id, email: user.email, fullName: user.full_name, role: normalizeRole(user.role) },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log in' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: { ...user, role: normalizeRole(user.role) } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'currentPassword and newPassword are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    // Fetch the stored password for this user
    const stored = await User.getPasswordById(req.user.userId);
    if (stored === null) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Plain-text comparison (swap for bcrypt.compare once hashing is added)
    if (currentPassword !== stored) {
      return res.status(422).json({ error: 'Current password is incorrect' });
    }

    // Save the new password (swap for bcrypt.hash once hashing is added)
    await User.updatePassword(req.user.userId, newPassword);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update password' });
  }
};

exports.updateName = async (req, res) => {
  try {
    const { fullName } = req.body;
    if (!fullName?.trim()) return res.status(400).json({ error: 'Name is required.' });
    await db.query('UPDATE User SET full_name = ? WHERE user_id = ?', [fullName.trim(), req.user.userId]);
    res.json({ message: 'Name updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update name.' });
  }
};