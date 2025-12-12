import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../data');

let museums = [];

function loadMuseums() {
  try {
    const museumsPath = path.join(dataDir, 'museums.json');
    if (!fs.existsSync(museumsPath)) {
      console.error('Museums file not found at:', museumsPath);
      return [];
    }
    const museumsData = JSON.parse(fs.readFileSync(museumsPath, 'utf8'));
    return museumsData.museums || museumsData;
  } catch (err) {
    console.error('Error loading museums:', err.message);
    return [];
  }
}

// Load museums on startup
museums = loadMuseums();

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // If museums not loaded, try loading again
  if (!museums || museums.length === 0) {
    museums = loadMuseums();
  }

  res.status(200).json({
    museums: museums,
    count: museums.length
  });
}
