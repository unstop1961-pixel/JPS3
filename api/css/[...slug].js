import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function handler(req, res) {
  try {
    const slug = req.query.slug ? req.query.slug.join('/') : '';
    const filePath = path.join(__dirname, '../../frontend/css', slug);
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(path.join(__dirname, '../../frontend/css'))) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.status(200).send(content);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (err) {
    console.error('CSS handler error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
