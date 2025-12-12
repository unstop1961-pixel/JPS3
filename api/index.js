import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

let museums = [];
let quizzes = [];
let museumQuizzes = {};

// Load data once
try {
  const museumsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'museums.json'), 'utf8'));
  museums = museumsData.museums || museumsData;
} catch (err) {
  console.error('Error loading museums:', err.message);
}

try {
  const quizzesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'quiz.json'), 'utf8'));
  quizzes = quizzesData.quizzes || quizzesData;
} catch (err) {
  console.error('Error loading quiz:', err.message);
}

try {
  const museumQuizzesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'museum-quiz.json'), 'utf8'));
  museumQuizzes = museumQuizzesData.museumQuizzes || {};
} catch (err) {
  console.error('Error loading museum quizzes:', err.message);
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

  res.status(200).json({
    message: 'Digital Museum Guide API',
    version: '1.0.0',
    museums: museums.length,
    quizzes: quizzes.length
  });
}
