import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

export default function handler(req, res) {
  try {
    const slug = req.query.slug ? req.query.slug.join('/') : '';
    const filePath = path.join(__dirname, '../../frontend/images', slug);
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(path.join(__dirname, '../../frontend/images'))) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
      
      const content = fs.readFileSync(filePath);
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.status(200).send(content);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (err) {
    console.error('Images handler error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
