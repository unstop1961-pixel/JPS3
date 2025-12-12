import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../../data');
const userDataFile = path.join(dataDir, 'users.json');

// Helper function to hash password
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'museum-guide-salt').digest('hex');
}

// Load users
function loadUsers() {
  if (fs.existsSync(userDataFile)) {
    try {
      return JSON.parse(fs.readFileSync(userDataFile, 'utf8'));
    } catch {
      return {};
    }
  }
  return {};
}

// Save users - gracefully handle errors on serverless (no write access)
function saveUsers(users) {
  try {
    // Ensure directory exists
    const dir = path.dirname(userDataFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(userDataFile, JSON.stringify(users, null, 2));
  } catch (err) {
    // On Vercel, file system writes fail - this is expected
    // User data is managed client-side via localStorage
    console.warn('Note: User data persistence requires database. Using client-side storage.');
  }
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // In Vercel, the slug is in req.query.slug (array)
  const slug = req.query.slug ? req.query.slug.join('/') : '';
  
  if (slug === 'signup' && req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    if (username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const users = loadUsers();

    if (users[username]) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    users[username] = {
      username,
      password: hashPassword(password),
      createdAt: new Date(),
      wishlist: [],
      visitedLog: [],
      reviewDiary: [],
      quizScores: []
    };

    saveUsers(users);
    res.json({ message: 'Signup successful', user: { username } });
  } else if (slug === 'login' && req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const users = loadUsers();
    const user = users[username];

    if (!user || user.password !== hashPassword(password)) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.json({
      message: 'Login successful',
      user: { username: user.username }
    });
  } else {
    res.status(404).json({ message: 'Not found' });
  }
}
