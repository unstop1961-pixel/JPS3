# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Backend Dependencies (1 minute)
```bash
cd f:\vidyasetu\JPS3\backend
npm install
```

### Step 2: Start Backend Server (Terminal 1)
```bash
npm start
```
You should see: `Server running on http://localhost:3000`

### Step 3: Start Frontend Server (Terminal 2)
```bash
cd f:\vidyasetu\JPS3\frontend
python -m http.server 8000
```
Or using Node:
```bash
npx http-server
```

### Step 4: Open in Browser
Navigate to: **http://localhost:8000**

---

## 📋 First Steps

1. **Create Account**
   - Click "Login/Signup"
   - Click "Sign Up" tab
   - Enter name, email, password
   - Click "Sign Up"

2. **Login**
   - Enter your email and password
   - Click "Login"

3. **Explore Museums**
   - Click "Museum Directory"
   - Search for museums
   - Click "View Profile" for details

4. **Track Your Journey**
   - Click "Dashboard"
   - Add museums to wishlist
   - Log visits with dates
   - Leave reviews with ratings

5. **Take Heritage Quiz**
   - Click "Heritage Quiz"
   - Answer 12 questions
   - Submit and see your score

---

## ✅ What's Included

✅ **16 Museums** across India
✅ **12 Heritage Questions** in the quiz
✅ **User Authentication** with email/password
✅ **Personal Dashboard** for tracking visits
✅ **Review System** with star ratings
✅ **Search Functionality** for museums
✅ **Responsive Design** for all devices
✅ **Data Persistence** for user information

---

## 🎯 Demo Data

**Museums Included:**
- National Museum, Delhi
- National Rail Museum, Delhi
- Indian Museum, Kolkata
- Chhatrapati Shivaji Maharaj Vastu Sangrahalaya, Mumbai
- And 12 more!

**Quiz Topics:**
- Maurya Dynasty
- Gupta Dynasty
- Chola Dynasty
- Buddhist Art (Ajanta, Ellora)
- Mughal Architecture
- South Indian Sculpture
- And more!

---

## 📁 File Structure

```
JPS3/
├── backend/
│   ├── server.js         ← Express.js app
│   └── package.json      ← Dependencies
├── frontend/
│   ├── index.html        ← Main page
│   ├── css/styles.css    ← Styling
│   └── js/script.js      ← Functionality
├── data/
│   ├── museums.json      ← Museum data
│   ├── quiz.json         ← Quiz questions
│   └── users.json        ← User data (auto-created)
└── README.md             ← Full documentation
```

---

## 🔧 Troubleshooting

### Backend won't start
```bash
# Try a different port
# Edit backend/server.js line 5: const PORT = 3001;
npm start
```

### Can't connect to backend
- Check backend is running on port 3000
- Check CORS is enabled
- Clear browser cache (Ctrl+Shift+Delete)

### Data not saving
- Ensure backend has write access to `data/` folder
- Check `users.json` was created after signup

---

## 📚 Full Documentation

See **README.md** for:
- Detailed setup instructions
- All features explained
- API endpoint documentation
- Customization guide
- Security recommendations
- Troubleshooting guide

---

## 🎓 Learning Resources

This project demonstrates:
- Node.js and Express.js backend development
- Frontend JavaScript with APIs
- Local storage and session management
- JSON data handling
- Responsive web design
- Form validation
- Quiz implementation

---

## 💡 Tips

1. **Search works with partial matches** - type "art" to find museums related to art
2. **Quiz explanations help learning** - read them after submitting
3. **Reviews are personal** - write honest experiences
4. **Wishlist helps planning** - add museums before visiting
5. **Data persists after logout** - your journey is saved

---

## 🎉 You're Ready!

Your Digital Museum Guide is now ready to use. Start exploring India's cultural heritage!

**Need help?** Check the README.md file for detailed documentation.

Happy exploring! 🏛️
