# Technical Documentation

## Architecture Overview

### Frontend Architecture
```
Frontend (Client-Side)
│
├── HTML (index.html)
│   └── Defines page structure and layout
│
├── CSS (styles.css)
│   └── Styling with CSS Grid, Flexbox, and responsive design
│
└── JavaScript (script.js)
    ├── API calls to backend
    ├── Page management (show/hide pages)
    ├── User authentication
    ├── Data display and manipulation
    └── Local storage management
```

### Backend Architecture
```
Backend (Server-Side)
│
├── Express.js Server
│   ├── Middleware (CORS, Body Parser)
│   │
│   ├── API Routes
│   │   ├── Authentication (/api/auth/*)
│   │   ├── Museums (/api/museums/*)
│   │   ├── Dashboard (/api/user/*)
│   │   └── Quiz (/api/user/quiz-*)
│   │
│   └── Data Management
│       ├── In-memory user storage
│       └── File-based persistence (users.json)
│
├── Data Files
│   ├── museums.json (read-only)
│   ├── quiz.json (read-only)
│   └── users.json (generated at runtime)
```

---

## Core Components

### 1. Authentication System

**Flow:**
```
User Input
    ↓
Frontend Validation
    ↓
API Request to Backend
    ↓
Backend Check (Email exists?)
    ↓
Save to users.json / Check password
    ↓
Return Success/Error
    ↓
Store in localStorage
    ↓
Update Navigation
```

**Data Structure:**
```javascript
{
  "email@example.com": {
    "username": "User Name",
    "email": "email@example.com",
    "password": "plain_text_password",  // TODO: Hash in production
    "createdAt": "2025-01-01T...",
    "wishlist": [{museumId, addedDate}],
    "visitedLog": [{museumId, visitDate, timestamp}],
    "reviewDiary": [{museumId, rating, notes, reviewDate}],
    "quizScores": [{score, totalQuestions, percentage, answers, attemptDate}]
  }
}
```

### 2. Museum Management

**Data Structure:**
```javascript
{
  "id": 1,
  "name": "Museum Name",
  "city": "City",
  "state": "State",
  "description": "Description",
  "openingHours": "10:00 AM - 5:00 PM",
  "ticketPrice": "Price Info",
  "website": "URL",
  "address": "Full Address",
  "topExhibits": [
    {
      "name": "Exhibit Name",
      "description": "Description",
      "image": "filename.jpg"
    }
  ]
}
```

**Key Features:**
- Search: Case-insensitive search by name, city, state
- Profile: Complete museum information with exhibits
- Actions: Wishlist, visited log, reviews

### 3. Dashboard System

**Three Main Sections:**

#### A. Wishlist
```javascript
{
  "museumId": 1,
  "addedDate": "2025-01-15T10:30:00.000Z"
}
```
- Add museums to visit later
- Remove from wishlist
- View in order added

#### B. Visited Log
```javascript
{
  "museumId": 1,
  "visitDate": "2025-01-15",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```
- Log museum visits with date
- View history chronologically
- Plan future visits

#### C. Review Diary
```javascript
{
  "museumId": 1,
  "rating": 5,
  "notes": "Great experience",
  "reviewDate": "2025-01-15T10:30:00.000Z"
}
```
- 1-5 star ratings
- Personal notes/experiences
- Date-stamped reviews

### 4. Quiz System

**Question Structure:**
```javascript
{
  "id": 1,
  "question": "Question text?",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 1,  // Index (0-3)
  "explanation": "Why this is correct..."
}
```

**Quiz Flow:**
```
Load Questions
    ↓
Display Quiz Form
    ↓
User Answers (Radio buttons)
    ↓
Submit → Calculate Score
    ↓
Compare with correctAnswer
    ↓
Display Result with Percentage
    ↓
Save to User's quizScores
    ↓
Show Feedback Based on Score
```

**Score Storage:**
```javascript
{
  "score": 8,
  "totalQuestions": 12,
  "percentage": "66.67",
  "answers": [
    {
      "questionId": 1,
      "selectedAnswer": 1,
      "correctAnswer": 1
    }
  ],
  "attemptDate": "2025-01-15T10:30:00.000Z"
}
```

---

## API Endpoints

### Authentication APIs

**POST /api/auth/signup**
```javascript
Request: {
  "username": "User Name",
  "email": "user@example.com",
  "password": "password123"
}

Response: {
  "message": "Signup successful",
  "user": { "username", "email" }
}
```

**POST /api/auth/login**
```javascript
Request: {
  "email": "user@example.com",
  "password": "password123"
}

Response: {
  "message": "Login successful",
  "user": { "username", "email" }
}
```

### Museum APIs

**GET /api/museums**
```
Returns: Array of all museums
```

**GET /api/museums/:id**
```
Returns: Single museum object by ID
```

**GET /api/museums/search/:query**
```
Parameters: query = search term
Returns: Filtered museums array
```

### User Dashboard APIs

**GET /api/user/dashboard/:email**
```
Returns: {
  "username", "email",
  "wishlist": [],
  "visitedLog": [],
  "reviewDiary": [],
  "quizScores": []
}
```

**POST /api/user/wishlist/:email**
```javascript
Request: { "museumId": 1 }
Returns: Updated wishlist
```

**DELETE /api/user/wishlist/:email/:museumId**
```
Returns: Updated wishlist
```

**POST /api/user/visited/:email**
```javascript
Request: {
  "museumId": 1,
  "visitDate": "2025-01-15"
}
Returns: Updated visitedLog
```

**POST /api/user/review/:email**
```javascript
Request: {
  "museumId": 1,
  "rating": 5,
  "notes": "Great museum!"
}
Returns: Updated reviewDiary
```

### Quiz APIs

**GET /api/quiz**
```
Returns: Array of all quiz questions
```

**POST /api/user/quiz-score/:email**
```javascript
Request: {
  "score": 8,
  "totalQuestions": 12,
  "answers": [...]
}
Returns: Updated quizScores
```

**GET /api/user/quiz-history/:email**
```
Returns: Array of all quiz attempts
```

---

## Frontend State Management

### Global Variables
```javascript
let currentUser = null;           // {username, email}
let museums = [];                 // Array of all museums
let quizzes = [];                 // Array of all quiz questions
let filteredMuseums = [];         // Search results
let reviewMuseumId = null;        // Current review target
```

### Local Storage
```javascript
// Stores: JSON string of currentUser object
localStorage.setItem('currentUser', JSON.stringify(currentUser));
let user = JSON.parse(localStorage.getItem('currentUser'));
```

### Page Management
```javascript
// All pages: #home, #directory, #museum-profile, #auth, 
//            #dashboard, #review-form, #quiz

showPage('home');  // Hide all, show 'home'
```

---

## Key Functions

### Authentication
```javascript
signup()        // Create new user account
login()         // Authenticate user
logout()        // Clear session
updateNavigation()  // Update UI based on auth state
```

### Museums
```javascript
loadMuseums()       // Fetch all museums from API
displayMuseums()    // Render museums in grid
searchMuseums()     // Search museums
showMuseumProfile() // Display single museum details
```

### Dashboard
```javascript
loadDashboard()     // Fetch user dashboard data
displayDashboard()  // Render all sections
addToWishlist()     // Add museum to wishlist
removeFromWishlist() // Remove from wishlist
addVisitedLog()     // Log a visit
```

### Reviews
```javascript
showReviewForm()    // Display review form
submitReview()      // Save review to backend
initStarRating()    // Initialize star click handlers
```

### Quiz
```javascript
loadQuiz()          // Fetch quiz questions
displayQuiz()       // Render all questions
submitQuiz()        // Calculate score and save
displayQuizResult() // Show results
```

---

## Error Handling

### Frontend Error Handling
```javascript
// All API calls use:
try {
  const response = await fetch(url);
  const data = await response.json();
  if (success) {
    showAlert('Success message', 'success');
  } else {
    showAlert('Error message', 'error');
  }
} catch (error) {
  showAlert('Network error', 'error');
}
```

### Alert System
```javascript
showAlert(message, type);
// Types: 'success', 'error', 'info'
// Auto-removes after 5 seconds
```

### Common Error Scenarios
1. **Network Error**: Backend not running
2. **CORS Error**: Browser security blocking
3. **Invalid Credentials**: Wrong email/password
4. **Missing Data**: JSON parsing failed
5. **Validation Error**: Required fields empty

---

## Performance Considerations

### Frontend Optimization
- Single file loading (index.html loads everything)
- CSS and JS minimization (not done yet)
- Image optimization (using emojis instead)
- Event delegation for dynamic elements
- localStorage for user session

### Backend Optimization
- File-based JSON (fine for <1000 users)
- In-memory caching of data files
- No database queries (simple JSON read)
- Middleware ordering (CORS before routes)

### Scalability Improvements Needed
- Move to database (MongoDB, PostgreSQL)
- Implement caching layer (Redis)
- Use CDN for static assets
- Add pagination for museum list
- Implement API rate limiting

---

## Security Analysis

### Current Vulnerabilities
1. ❌ Passwords stored in plain text
2. ❌ No HTTPS/SSL encryption
3. ❌ No input sanitization
4. ❌ No SQL injection protection (not using SQL)
5. ❌ No CSRF tokens
6. ❌ Exposed API endpoints

### Security Recommendations
1. ✅ Hash passwords with bcrypt
2. ✅ Use HTTPS in production
3. ✅ Validate all inputs (server-side)
4. ✅ Use environment variables for secrets
5. ✅ Implement JWT tokens for auth
6. ✅ Add rate limiting
7. ✅ Use secure HTTP headers
8. ✅ Regular security audits

---

## Testing Checklist

### Unit Testing
- [ ] signup() with valid/invalid data
- [ ] login() with correct/wrong credentials
- [ ] searchMuseums() with various queries
- [ ] Rating calculation
- [ ] Score calculation

### Integration Testing
- [ ] Complete signup flow
- [ ] Complete login flow
- [ ] Museum browsing and search
- [ ] Dashboard operations
- [ ] Quiz completion

### UI Testing
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Button interactions
- [ ] Form validation
- [ ] Navigation flow

### API Testing
- [ ] All endpoints respond correctly
- [ ] Error responses are handled
- [ ] Data persistence works
- [ ] CORS requests work

---

## Code Quality

### Naming Conventions
- camelCase for variables and functions
- PascalCase for classes (none currently)
- Descriptive names (e.g., loadMuseums not loadM)
- Comments for complex logic

### File Organization
- Separation of concerns (HTML, CSS, JS)
- Logical grouping of functions
- Consistent indentation (2 spaces)
- Clear section comments

### Best Practices Used
- ✅ Function organization
- ✅ Variable scoping
- ✅ Error handling
- ✅ Comments and documentation
- ⚠️ Code could be refactored into modules

---

## Deployment Checklist

### Development → Production
- [ ] Hash all passwords
- [ ] Setup HTTPS/SSL
- [ ] Setup database (MongoDB/PostgreSQL)
- [ ] Setup Redis caching
- [ ] Setup environment variables (.env)
- [ ] Setup CI/CD pipeline
- [ ] Security audit
- [ ] Performance testing
- [ ] Load testing
- [ ] Backup strategy
- [ ] Monitoring/logging setup
- [ ] Update API URLs
- [ ] Setup email notifications
- [ ] Setup password reset flow

---

## Future Architecture

### Recommended Upgrade
```
Frontend (React/Vue)
    ↓
API Gateway (Express/FastAPI)
    ↓
Microservices
├── Auth Service (JWT)
├── Museum Service (Database)
├── User Service (Database)
└── Quiz Service (Database)
    ↓
Database (PostgreSQL/MongoDB)
    ↓
Cache Layer (Redis)
    ↓
CDN (AWS CloudFront)
```

---

*This documentation covers the technical implementation of the Digital Museum Guide.*
*For user documentation, see README.md and QUICKSTART.md*
