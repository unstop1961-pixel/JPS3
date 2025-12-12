import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../../data');
const userDataFile = path.join(dataDir, 'users.json');

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

// Save users
function saveUsers(users) {
  try {
    const dir = path.dirname(userDataFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(userDataFile, JSON.stringify(users, null, 2));
  } catch (err) {
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

  const { username } = req.query;
  const users = loadUsers();

  if (req.method === 'GET') {
    const user = users[username];
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } else if (req.method === 'POST') {
    res.status(400).json({ message: 'Use specific endpoint' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
