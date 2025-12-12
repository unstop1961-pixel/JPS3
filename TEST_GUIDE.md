# Quick Test Guide - New Features

## 🚀 Start the App Locally

```bash
cd F:\vidyasetu\JPS3
npm start --prefix backend
```

Visit: **http://localhost:3000**

---

## ✅ Test Plan - 5 New Features

### 1️⃣ **Test Museum Map & Filters**

**Steps:**
1. Click "Map" in navigation
2. Select "Delhi" from State filter
3. See museums in Delhi appear
4. Change to "Tamil Nadu"
5. Set Max Price to 200
6. See filtered results
7. Click a museum to view details

**Expected:**
- ✅ Filters update instantly
- ✅ Museum list changes
- ✅ Can click to view profile

---

### 2️⃣ **Test Enhanced Search**

**Steps:**
1. Go to "Museums" (Directory)
2. Type "National" in search
3. See results filter in real-time
4. Type "Delhi"
5. See Delhi museums
6. Clear search to see all

**Expected:**
- ✅ Results filter as you type
- ✅ Works with name, city, state
- ✅ Shows count of results

---

### 3️⃣ **Test Achievements & Profile**

**Steps:**
1. Sign up or login
2. Visit at least 3 museums (mark as visited)
3. Click "Profile" in navigation
4. See your stats
5. See achievement badges for visits
6. Take 1 quiz
7. Check Profile again to see Scholar badge

**Expected:**
- ✅ Profile shows visit count
- ✅ Achievement badges appear
- ✅ Badges unlock as you progress
- ✅ Statistics accurate

---

### 4️⃣ **Test Social Sharing**

**Steps:**
1. Go to Profile (after login & visit at least 1 museum)
2. Scroll to "Share Your Journey"
3. Click "Share on Twitter"
4. See pre-filled message
5. Click "Copy Profile Link"
6. Paste in notepad - check format

**Expected:**
- ✅ Twitter opens with message
- ✅ Message includes visit count
- ✅ Profile link copied correctly

---

### 5️⃣ **Test Enhanced Museum Cards**

**Steps:**
1. Go to "Museums" directory
2. Look at museum cards
3. See all cards have:
   - Image
   - Name
   - Location
   - Price
   - Description
4. Click "❤️ Wishlist" on a card
5. Click "View Details" on a card
6. See both work properly

**Expected:**
- ✅ Cards display clearly
- ✅ Emojis appear correctly
- ✅ Buttons are functional

---

## 🎯 Full User Journey Test

Complete this end-to-end test:

```
1. Open http://localhost:3000
2. Sign up: username "testuser", password "test123"
3. Search for "National Museum"
4. Click "View Details"
5. Click "Mark as Visited"
6. Take the museum quiz (get at least 5/10)
7. Write a review (rate 5 stars, add comments)
8. Go to Dashboard - see visit logged
9. Go to Profile - see "Explorer" badge
10. Go to Map - filter by "Delhi"
11. Mark 2 more museums as visited
12. Go to Profile - see "Wanderer" badge
13. Click "Share on Twitter"
14. Click "Copy Profile Link"
15. Verify everything works!
```

**Expected Duration:** 5-10 minutes
**Success Criteria:** All 15 steps complete with ✅

---

## 🐛 Known Issues & Workarounds

### Issue 1: Achievements not updating
**Fix:** Refresh page after marking museum visited

### Issue 2: Profile page shows "Loading..."
**Fix:** Make sure you're logged in first

### Issue 3: Sharing buttons not working
**Fix:** Check browser console (F12) for errors

### Issue 4: Map page blank
**Fix:** Make sure at least 1 museum is loaded first

---

## 📝 Feedback Checklist

- [ ] Museum Map filters work smoothly
- [ ] Search responds instantly
- [ ] Achievement badges appear correctly
- [ ] Profile page displays well
- [ ] Social sharing buttons functional
- [ ] Cards look good on mobile
- [ ] Navigation items appear correctly
- [ ] No console errors

---

## 🎉 What to Check

**Visual Design:**
- ✅ Colors are consistent
- ✅ Buttons are visible and clickable
- ✅ Responsive on mobile
- ✅ Icons display properly

**Functionality:**
- ✅ All filters work
- ✅ Search is real-time
- ✅ Achievements unlock correctly
- ✅ Sharing opens correct platforms
- ✅ Profile displays stats

**User Experience:**
- ✅ Navigation is intuitive
- ✅ Clear feedback on actions
- ✅ Fast performance
- ✅ No missing features

---

## 🚀 Deploy After Testing

Once all tests pass:

```bash
git add .
git commit -m "Add 5 new features: map filters, achievements, profile, social sharing"
git push origin main
```

Then redeploy on Vercel!

---

**Happy Testing! 🎉**
