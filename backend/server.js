const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const https = require('https');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Load data
let museums = [];
let quizzes = [];
let museumQuizzes = {};

try {
  const museumsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/museums.json'), 'utf8'));
  museums = museumsData.museums || museumsData;
  console.log(`✓ Loaded ${museums.length} museums`);
} catch (err) {
  console.error('Error loading museums:', err.message);
}

try {
  const quizzesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/quiz.json'), 'utf8'));
  quizzes = quizzesData.quizzes || quizzesData;
  console.log(`✓ Loaded ${quizzes.length} quiz questions`);
} catch (err) {
  console.error('Error loading quiz:', err.message);
}

try {
  const museumQuizzesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/museum-quiz.json'), 'utf8'));
  museumQuizzes = museumQuizzesData.museumQuizzes || {};
  console.log(`✓ Loaded museum-specific quizzes for ${Object.keys(museumQuizzes).length} museums`);
} catch (err) {
  console.error('Error loading museum quizzes:', err.message);
}

// User data storage
let users = {};
let userDataFile = path.join(__dirname, '../data/users.json');

// Load existing user data if available
if (fs.existsSync(userDataFile)) {
  users = JSON.parse(fs.readFileSync(userDataFile, 'utf8'));
}

// Helper function to save user data
function saveUserData() {
  fs.writeFileSync(userDataFile, JSON.stringify(users, null, 2));
}

// Routes

// 1. Authentication Routes
app.post('/api/auth/signup', (req, res) => {
  const { username, password } = req.body;

  if (users[username]) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  users[username] = {
    username,
    password, // In production, should hash this
    createdAt: new Date(),
    wishlist: [],
    visitedLog: [],
    reviewDiary: [],
    quizScores: []
  };

  saveUserData();
  res.json({ message: 'Signup successful', user: { username } });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  const user = users[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  res.json({
    message: 'Login successful',
    user: {
      username: user.username
    }
  });
});

// 2. Museum Routes
app.get('/api/museums', (req, res) => {
  try {
    res.json({ museums: museums, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error loading museums', success: false });
  }
});

app.get('/api/museums/:id', (req, res) => {
  try {
    const museum = museums.find(m => m.id === parseInt(req.params.id));
    if (!museum) {
      return res.status(404).json({ message: 'Museum not found', success: false });
    }
    res.json({ museum: museum, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error loading museum', success: false });
  }
});

app.get('/api/museums/search/:query', (req, res) => {
  try {
    const query = req.params.query.toLowerCase();
    if (!query || query.trim() === '') {
      return res.json({ museums: museums, success: true });
    }
    const results = museums.filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.city.toLowerCase().includes(query) ||
      m.state.toLowerCase().includes(query) ||
      m.description.toLowerCase().includes(query)
    );
    res.json({ museums: results, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error searching museums', success: false, error: error.message });
  }
});

// 3. Dashboard Routes
app.get('/api/user/dashboard/:username', (req, res) => {
  const user = users[req.params.username];
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    username: user.username,
    wishlist: user.wishlist,
    visitedLog: user.visitedLog,
    reviewDiary: user.reviewDiary,
    quizScores: user.quizScores
  });
});

// Add to Wishlist
app.post('/api/user/wishlist/:username', (req, res) => {
  const user = users[req.params.username];
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { museumId } = req.body;
  if (!user.wishlist.find(m => m.museumId === museumId)) {
    user.wishlist.push({
      museumId,
      addedDate: new Date()
    });
    saveUserData();
  }

  res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
});

// Add to Visited Log
app.post('/api/user/visited/:username', (req, res) => {
  const user = users[req.params.username];
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { museumId, visitDate } = req.body;
  user.visitedLog.push({
    museumId,
    visitDate,
    timestamp: new Date()
  });
  saveUserData();

  res.json({ message: 'Added to visited log', visitedLog: user.visitedLog });
});

// Add Review
app.post('/api/user/review/:username', (req, res) => {
  const user = users[req.params.username];
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { museumId, rating, notes } = req.body;
  user.reviewDiary.push({
    museumId,
    rating,
    notes,
    reviewDate: new Date()
  });
  saveUserData();

  res.json({ message: 'Review added', reviewDiary: user.reviewDiary });
});

// Remove from Wishlist
app.delete('/api/user/wishlist/:username/:museumId', (req, res) => {
  const user = users[req.params.username];
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.wishlist = user.wishlist.filter(m => m.museumId !== parseInt(req.params.museumId));
  saveUserData();

  res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
});

// 4. Quiz Routes
app.get('/api/quiz', (req, res) => {
  try {
    if (!quizzes || quizzes.length === 0) {
      console.log('Quiz data:', quizzes);
      return res.status(500).json({ message: 'Quiz data not loaded', success: false, quizzes: [] });
    }
    res.json({ quizzes: quizzes, success: true, count: quizzes.length });
  } catch (error) {
    console.error('Quiz loading error:', error);
    res.status(500).json({ message: 'Error loading quiz', success: false, error: error.message });
  }
});

// Museum-specific quiz route
app.get('/api/museum-quiz/:museumId', (req, res) => {
  try {
    const museumId = req.params.museumId;
    console.log(`[Quiz] Requested ID: ${museumId}, Available keys: ${Object.keys(museumQuizzes).join(', ')}`);
    const quiz = museumQuizzes[museumId];
    
    if (!quiz) {
      console.log(`[Quiz] Not found for ID: ${museumId}`);
      return res.status(404).json({ message: 'No quiz found for this museum', success: false });
    }
    
    res.json({ success: true, quiz: quiz });
  } catch (error) {
    console.error('Museum quiz loading error:', error);
    res.status(500).json({ message: 'Error loading museum quiz', success: false, error: error.message });
  }
});

app.post('/api/user/quiz-score/:username', (req, res) => {
  const user = users[req.params.username];
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { museumId, museumName, score, totalQuestions, percentage, answers } = req.body;
  user.quizScores.push({
    museumId,
    museumName,
    score,
    totalQuestions,
    percentage: percentage || (score / totalQuestions * 100).toFixed(2),
    answers,
    attemptDate: new Date()
  });
  saveUserData();

  res.json({
    message: 'Quiz score recorded',
    quizScores: user.quizScores,
    latestScore: user.quizScores[user.quizScores.length - 1]
  });
});

app.get('/api/user/quiz-history/:username', (req, res) => {
  const user = users[req.params.username];
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user.quizScores);
});
// 5. Real-time Information Routes
// Wikipedia API for museum information
app.get('/api/museum-info/:name', (req, res) => {
  const museumName = encodeURIComponent(req.params.name);
  const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${museumName}&prop=extracts&explaintext=true&format=json`;

  https.get(wikiUrl, (wikiRes) => {
    let data = '';
    wikiRes.on('data', chunk => data += chunk);
    wikiRes.on('end', () => {
      try {
        const result = JSON.parse(data);
        const pages = result.query.pages;
        const pageId = Object.keys(pages)[0];
        const extract = pages[pageId].extract || 'Information not available';
        res.json({ success: true, information: extract });
      } catch (err) {
        res.json({ success: false, information: 'Could not fetch information' });
      }
    });
  }).on('error', (err) => {
    console.error('Wikipedia API error:', err);
    res.json({ success: false, information: 'API unavailable' });
  });
});

// Google Maps - Museum location verification (using static data)
app.get('/api/museum-location/:name/:city', (req, res) => {
  const { name, city } = req.params;
  const museum = museums.find(m => 
    m.name.toLowerCase().includes(name.toLowerCase()) && 
    m.city.toLowerCase() === city.toLowerCase()
  );
  
  if (!museum) {
    return res.json({ success: false, message: 'Museum not found' });
  }

  res.json({
    success: true,
    name: museum.name,
    city: museum.city,
    address: museum.address,
    mapLink: `https://www.google.com/maps/search/${encodeURIComponent(museum.address)}`
  });
});

// Serve static files (must be after API routes)
app.use(express.static(path.join(__dirname, '../frontend')));

// Start Server
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`);
  console.log(`║  Digital Museum Guide Server                             ║`);
  console.log(`║  ✓ Running on http://localhost:${PORT}`);
  console.log(`║  ✓ ${museums.length} museums loaded`);
  console.log(`║  ✓ ${quizzes.length} quiz questions loaded`);
  console.log(`║  ✓ Real-time APIs enabled (Wikipedia, Google Maps)      ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝\n`);
});
