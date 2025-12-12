import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../data');

let museums = [];
let quizzes = [];
let museumQuizzes = {};

// Helper functions to load data
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

function loadQuizzes() {
  try {
    const quizzesPath = path.join(dataDir, 'quiz.json');
    if (!fs.existsSync(quizzesPath)) {
      console.error('Quiz file not found at:', quizzesPath);
      return [];
    }
    const quizzesData = JSON.parse(fs.readFileSync(quizzesPath, 'utf8'));
    return quizzesData.quizzes || quizzesData;
  } catch (err) {
    console.error('Error loading quizzes:', err.message);
    return [];
  }
}

function loadMuseumQuizzes() {
  try {
    const museumQuizzesPath = path.join(dataDir, 'museum-quiz.json');
    if (!fs.existsSync(museumQuizzesPath)) {
      console.error('Museum quizzes file not found at:', museumQuizzesPath);
      return {};
    }
    const museumQuizzesData = JSON.parse(fs.readFileSync(museumQuizzesPath, 'utf8'));
    return museumQuizzesData.museumQuizzes || {};
  } catch (err) {
    console.error('Error loading museum quizzes:', err.message);
    return {};
  }
}

// Load data on startup
museums = loadMuseums();
quizzes = loadQuizzes();
museumQuizzes = loadMuseumQuizzes();

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
    quizzes: quizzes.length,
    museumQuizzes: Object.keys(museumQuizzes).length
  });
}
