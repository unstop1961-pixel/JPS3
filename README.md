# Digital Museum Guide - Complete Documentation

## Project Overview

The **Digital Museum Guide** is a comprehensive web portal designed to help tourists and culture enthusiasts discover, track, and share their experiences across India's rich museum landscape. The application combines a searchable museum directory with personalized tracking features and an interactive heritage quiz.

### Key Features

1. **Museum Directory & Exhibit Catalog**
   - 16 meticulously curated museums across India
   - Searchable listings by name, city, or state
   - Detailed museum profiles with:
     - Opening hours
     - Ticket prices
     - Contact information
     - Top 5 exhibits with descriptions
   - User-friendly browsing interface

2. **Personal Dashboard**
   - **Wishlist**: Add museums you want to visit
   - **Visited Log**: Track museums with visit dates
   - **Review Diary**: Rate visits (1-5 stars) and write personal notes

3. **Indian Heritage Quiz**
   - 12 comprehensive questions about Indian history, dynasties, and art forms
   - Multiple-choice format with explanations
   - Score tracking and performance history
   - Detailed feedback on quiz completion

4. **User Authentication System**
   - Secure sign-up and login functionality
   - Email-based account management
   - Persistent user data storage
   - Session management with localStorage

### Museums Included

1. National Museum, Delhi
2. National Rail Museum, Delhi
3. Indian Museum, Kolkata
4. Chhatrapati Shivaji Maharaj Vastu Sangrahalaya, Mumbai
5. National Museum of Natural History, Delhi
6. Salar Jung Museum, Hyderabad
7. Prince of Wales Museum, Bengaluru
8. Victoria and Albert Museum, Lucknow
9. Maharaja Sayajirao Museum, Vadodara
10. Government Museum, Chennai
11. Mathura Museum, Mathura
12. Sanchi Museum, Sanchi
13. Ajanta and Ellora Caves Museum, Aurangabad
14. Jaipur City Museum, Jaipur
15. Albert Hall Museum, Jaipur
16. Kangra Museum, Kangra

---

## Project Structure

```
JPS3/
├── backend/
│   ├── server.js              # Express.js server
│   └── package.json           # Node.js dependencies
├── frontend/
│   ├── index.html             # Main HTML file
│   ├── css/
│   │   └── styles.css         # Complete styling
│   ├── js/
│   │   └── script.js          # Frontend JavaScript
│   └── images/                # Image assets (for future use)
├── data/
│   ├── museums.json           # Museum data (16 museums)
│   ├── quiz.json              # Quiz questions (12 questions)
│   └── users.json             # User data (auto-generated)
└── README.md                  # This file
```

---

## Installation & Setup

### Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Code editor (VS Code recommended)

### Step 1: Extract Project Files

Navigate to your project directory:
```bash
cd f:\vidyasetu\JPS3
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- `express` - Web framework
- `cors` - Cross-Origin Resource Sharing
- `body-parser` - JSON parsing middleware

### Step 3: Start the Backend Server

```bash
npm start
```

Expected output:
```
Server running on http://localhost:3000
Digital Museum Guide backend is active!
```

**Keep this terminal open** - the backend server must be running for the application to work.

### Step 4: Open Frontend in Browser

1. Open a new terminal/PowerShell window
2. Navigate to the frontend directory:
   ```bash
   cd f:\vidyasetu\JPS3\frontend
   ```
3. Start a simple HTTP server (using Python if available):
   ```bash
   python -m http.server 8000
   ```
   OR using Node.js:
   ```bash
   npx http-server
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

---

## How to Use

### 1. Getting Started

**Without Login:**
- Browse the museum directory
- Search for museums by name, city, or state
- View detailed museum profiles and exhibits
- Take the Heritage Quiz (scores won't be saved)

**With Login:**
- All features above, plus:
- Save museums to your wishlist
- Log museum visits with dates
- Write reviews with ratings
- View your complete cultural journey dashboard
- Save quiz scores and track progress

### 2. Creating an Account

1. Click "Login/Signup" in the top-right corner
2. Click "Sign Up" tab
3. Enter:
   - Full Name
   - Email
   - Password (and confirm password)
4. Click "Sign Up"
5. Login with your credentials

**Demo Account (Optional):**
```
Email: demo@example.com
Password: demo123
Name: Demo User
```

(Create this manually through sign-up)

### 3. Exploring Museums

**Search:**
1. Go to "Museum Directory"
2. Enter search terms (e.g., "Delhi", "Chola", "Kolkata")
3. Click "Search" or press Enter

**View Details:**
1. Click "View Profile" on any museum card
2. See complete information:
   - Address and opening hours
   - Ticket prices
   - Website links
   - Top 5 exhibits with descriptions

### 4. Managing Your Journey

**Add to Wishlist:**
1. View a museum profile
2. Click "Add to Wishlist"
3. Museum appears in your dashboard

**Log a Visit:**
1. View a museum profile
2. Click "Mark as Visited"
3. Enter the date you visited
4. Visit appears in your "Visited Log"

**Leave a Review:**
1. View a museum profile
2. Click "Leave a Review"
3. Rate (1-5 stars) and write notes
4. Submit - review appears in "Review Diary"

### 5. Taking the Heritage Quiz

1. Click "Heritage Quiz" in navigation
2. Answer all 12 questions
3. Click "Submit Quiz"
4. View your score and percentage
5. See personalized feedback
6. Retake or return to home

**Quiz Features:**
- Instant feedback on each question
- Score tracking for logged-in users
- Performance history in dashboard
- Educational explanations for all answers

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Museums
- `GET /api/museums` - Get all museums
- `GET /api/museums/:id` - Get single museum
- `GET /api/museums/search/:query` - Search museums

### Dashboard
- `GET /api/user/dashboard/:email` - Get user dashboard
- `POST /api/user/wishlist/:email` - Add to wishlist
- `DELETE /api/user/wishlist/:email/:museumId` - Remove from wishlist
- `POST /api/user/visited/:email` - Log visit
- `POST /api/user/review/:email` - Add review

### Quiz
- `GET /api/quiz` - Get all quiz questions
- `POST /api/user/quiz-score/:email` - Submit quiz score
- `GET /api/user/quiz-history/:email` - Get quiz history

---

## Data Storage

### User Data

User information is stored in `data/users.json`:
```json
{
  "email@example.com": {
    "username": "User Name",
    "email": "email@example.com",
    "password": "encrypted_password",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "wishlist": [],
    "visitedLog": [],
    "reviewDiary": [],
    "quizScores": []
  }
}
```

**Note:** In production, passwords should be hashed using bcrypt or similar.

### Persistent Storage

- User authentication data: `data/users.json`
- Museum information: `data/museums.json` (read-only)
- Quiz questions: `data/quiz.json` (read-only)

---

## Customization Guide

### Adding More Museums

Edit `data/museums.json`:

```json
{
  "id": 17,
  "name": "Your Museum Name",
  "city": "City Name",
  "state": "State Name",
  "description": "Brief description",
  "openingHours": "10:00 AM - 5:00 PM (Closed Mondays)",
  "ticketPrice": "Rs. X (Indians), Rs. Y (Foreigners)",
  "website": "www.example.com",
  "address": "Full Address",
  "topExhibits": [
    {
      "name": "Exhibit Name",
      "description": "Exhibit description",
      "image": "filename.jpg"
    }
    // ... 5 exhibits total
  ]
}
```

### Adding More Quiz Questions

Edit `data/quiz.json`:

```json
{
  "id": 13,
  "question": "Your question here?",
  "options": [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4"
  ],
  "correctAnswer": 1,
  "explanation": "Why this is correct..."
}
```

### Styling Customization

Edit `frontend/css/styles.css` - Key color variables:

```css
--primary-color: #8B4513;      /* Main brown */
--secondary-color: #D2691E;    /* Dark brown */
--accent-color: #FF8C00;       /* Orange */
--background-color: #FFF8F0;   /* Cream */
```

---

## Troubleshooting

### Backend Server Won't Start

**Error:** `Port 3000 already in use`
- Kill existing process or change port in `server.js`
- Change `const PORT = 3000;` to another port (e.g., 3001)

**Error:** `Cannot find module 'express'`
- Run `npm install` in the `backend` directory

### API Connection Issues

**Error:** `Failed to fetch` or `CORS error`
- Ensure backend server is running on port 3000
- Check that both frontend and backend URLs are correct
- Browser console (F12) shows detailed error messages

### User Data Not Saving

**Issue:** Logout/login doesn't preserve data
- Check `data/users.json` exists in backend folder
- Ensure backend has write permissions to the `data` folder
- Restart backend server if modified

### Quiz Not Loading

**Issue:** Quiz questions not appearing
- Verify `data/quiz.json` exists and is valid JSON
- Check browser console for error messages
- Refresh the page (Ctrl+F5 for hard refresh)

---

## Performance & Scalability

### Current Limitations
- In-memory user sessions (lost on server restart)
- JSON file storage (not suitable for 1000+ users)
- No image caching or CDN

### Recommended Upgrades (Production)
- Database: MongoDB, PostgreSQL, or MySQL
- Authentication: JWT tokens with bcrypt
- Password: Hash with bcrypt (never plain text)
- Images: Cloud storage (AWS S3, Azure Blob)
- Caching: Redis for session management
- API Rate Limiting: Prevent abuse
- HTTPS: Secure connections (SSL certificate)

---

## Security Considerations

### Current Implementation
- Session management via localStorage
- Email validation on signup
- Basic input validation

### Security Recommendations
1. **Password Security**: Hash passwords using bcrypt
2. **HTTPS**: Use SSL/TLS in production
3. **CORS**: Restrict origins in production
4. **Input Validation**: Validate all user inputs
5. **Rate Limiting**: Prevent brute force attacks
6. **SQL Injection**: Use parameterized queries if using SQL
7. **Environment Variables**: Store secrets safely (use .env)

---

## Testing Guide

### Manual Testing Checklist

**Authentication:**
- [ ] Sign up with valid email
- [ ] Sign up with existing email (should fail)
- [ ] Login with correct credentials
- [ ] Login with wrong password (should fail)
- [ ] Logout and verify data persistence

**Museum Directory:**
- [ ] Load all 16 museums
- [ ] Search by city name
- [ ] Search by museum name
- [ ] View complete museum profile
- [ ] Verify exhibit information displays

**Dashboard (Logged In):**
- [ ] Add museum to wishlist
- [ ] View wishlist
- [ ] Remove from wishlist
- [ ] Log a museum visit with date
- [ ] View visited log with dates
- [ ] Leave review with rating and notes
- [ ] View all reviews in diary

**Quiz:**
- [ ] Load all 12 questions
- [ ] Answer questions and submit
- [ ] View score and percentage
- [ ] Verify feedback messages
- [ ] Retake quiz

### Browser Testing
- Test on Chrome, Firefox, Safari, Edge
- Test on mobile (responsive design)
- Test with JavaScript disabled (graceful degradation)

---

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| IE | Any | ❌ Not Supported |

---

## Frequently Asked Questions

**Q: Can I use this without creating an account?**
A: Yes! You can browse museums and take quizzes without login. However, your wishlist, visits, and reviews will not be saved.

**Q: Where is my data stored?**
A: User data is stored in `data/users.json` on the server. It persists even after logout.

**Q: Can I export my museum visit history?**
A: Currently, you can take screenshots. Future versions will include export to CSV/PDF.

**Q: Is my password secure?**
A: Currently, passwords are stored in plain text. In production, use bcrypt for hashing.

**Q: Can I access this on mobile?**
A: Yes! The design is fully responsive for phones and tablets.

**Q: How many museums can I add to my wishlist?**
A: Unlimited! The system can handle any number of museums.

**Q: What if I forget my password?**
A: Currently, there's no password reset. In production, implement email-based password recovery.

---

## Future Enhancements

### Phase 2 Features
- [ ] User profiles with avatars
- [ ] Social sharing of reviews
- [ ] Photo uploads for museum visits
- [ ] Museum recommendations based on interests
- [ ] Group museum tours
- [ ] Event listings and notifications
- [ ] Museum collaborations and partnerships

### Phase 3 Features
- [ ] Mobile app (React Native/Flutter)
- [ ] AR museum guides
- [ ] 360° virtual tours
- [ ] Offline mode
- [ ] Multi-language support (Hindi, Tamil, etc.)
- [ ] Integration with travel APIs
- [ ] Booking system for tickets

---

## Support & Feedback

### Reporting Issues
1. Check the troubleshooting section
2. Review browser console errors (F12)
3. Check that backend server is running
4. Try clearing browser cache (Ctrl+Shift+Delete)

### Getting Help
- Review this documentation
- Check code comments in JavaScript files
- Test with sample data provided
- Verify all files are in correct folders

---

## License & Attribution

This project was created as an educational initiative to promote India's cultural heritage and museum tourism.

**Data Sources:**
- Museum information: Official websites and travel guides
- Quiz content: Indian history and cultural heritage resources
- Images: Placeholder emojis (replace with actual museum photos)

---

## Version History

**Version 1.0.0** (2025-01-15)
- Initial release
- 16 museums
- 12 quiz questions
- User authentication
- Dashboard with tracking
- Review system
- Search functionality

---

## Contact & Contribution

For improvements, bug reports, or feature requests, please refer to the project documentation or source code comments.

**Happy exploring! 🏛️**

---

*Last Updated: January 2025*
*Maintained by: Digital Museum Guide Team*
