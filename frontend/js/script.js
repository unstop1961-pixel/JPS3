// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Global State
let currentUser = null;
let museums = [];
let quizzes = [];
let filteredMuseums = [];

// Museum image mapping with local image files
const museumImages = {
  1: "images/museum-1.jpg",
  2: "images/museum-2.jpg",
  3: "images/museum-3.jpg",
  4: "images/museum-4.jpg",
  5: "images/museum-5.jpg",
  6: "images/museum-6.jpg",
  7: "images/museum-7.jpg",
  8: "images/museum-8.jpg",
  9: "images/museum-9.jpg",
  10: "images/museum-10.jpg",
  11: "images/museum-11.jpg",
  12: "images/museum-12.jpg",
  13: "images/museum-13.jpg",
  14: "images/museum-14.jpg",
  15: "images/museum-15.jpg",
  16: "images/museum-16.jpg"
};

// Page Management
function showPage(pageName) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  // Show selected page
  const page = document.getElementById(pageName);
  if (page) {
    page.classList.add('active');
  }

  // Scroll to top
  window.scrollTo(0, 0);
}

// Update Navigation based on Authentication
function updateNavigation() {
  const authButtons = document.querySelector('.auth-buttons');
  const userNavs = document.querySelectorAll('.user-nav');

  if (currentUser) {
    authButtons.innerHTML = `
      <span style="color: white; align-self: center;">Welcome, ${currentUser.username}!</span>
      <button onclick="logout()" class="btn btn-secondary btn-small">Sign Out</button>
    `;
    userNavs.forEach(nav => {
      nav.style.display = 'flex';
    });
  } else {
    authButtons.innerHTML = '';
    userNavs.forEach(nav => {
      nav.style.display = 'none';
    });
  }
}

function signup() {
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;

  if (!username || !password || !confirmPassword) {
    showAlert('Please fill all fields', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showAlert('Passwords do not match', 'error');
    return;
  }

  fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'Signup successful') {
        showAlert('Signup successful! Welcome!', 'success');
        currentUser = { ...data.user };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('username', currentUser.username);
        document.getElementById('signupForm').reset();
        updateNavigation();
        loadMuseums();
        loadDashboard();
        loadQuiz();
        showPage('home');
      } else {
        showAlert(data.message, 'error');
      }
    })
    .catch(err => showAlert('Error during signup', 'error'));
}

function login() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  if (!username || !password) {
    showAlert('Please fill all fields', 'error');
    return;
  }

  fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'Login successful') {
        currentUser = { ...data.user };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('username', username);
        showAlert(`Welcome, ${currentUser.username}!`, 'success');
        updateNavigation();
        loadMuseums();
        loadDashboard();
        loadQuiz();
        showPage('home');
        document.getElementById('loginForm').reset();
      } else {
        showAlert(data.message, 'error');
      }
    })
    .catch(err => showAlert('Error during login', 'error'));
}

function logout() {
  // Clear all user data from memory
  currentUser = null;
  
  // Clear all user-related localStorage
  localStorage.removeItem('currentUser');
  localStorage.removeItem('username');
  
  // Reset page state
  filteredMuseums = [];
  
  showAlert('Logged out successfully', 'success');
  updateNavigation();
  showPage('auth');
}

// Museum Functions
function loadMuseums() {
  fetch(`${API_BASE_URL}/museums`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('Museums loaded:', data);
      if (data.success && data.museums) {
        museums = data.museums;
        filteredMuseums = museums;
        displayMuseums(museums);
      } else if (Array.isArray(data)) {
        // Fallback for old format
        museums = data;
        filteredMuseums = museums;
        displayMuseums(museums);
      } else {
        showAlert('Museum data format error', 'error');
      }
    })
    .catch(err => {
      console.error('Error loading museums:', err);
      showAlert('Error loading museums: ' + err.message, 'error');
    });
}

function displayMuseums(museumsList) {
  const container = document.getElementById('museumGrid');
  if (!container) return;

  if (museumsList.length === 0) {
    container.innerHTML = '<p class="text-center">No museums found</p>';
    return;
  }

  container.innerHTML = museumsList.map(museum => `
    <div class="museum-card">
      <div class="museum-card-image">
        <img src="${museum.museumImage || museumImages[museum.id] || 'images/museum-placeholder.svg'}" alt="${museum.name}" style="width: 100%; height: 100%; object-fit: cover;"/>
      </div>
      <div class="museum-card-content">
        <h3>${museum.name}</h3>
        <p class="museum-card-location">${museum.city}, ${museum.state}</p>
        <p class="museum-card-description">${museum.description}</p>
        <div class="museum-card-footer">
          <button class="btn btn-primary btn-small" onclick="showMuseumProfile(${museum.id})">View Profile</button>
          ${currentUser ? `
            <button class="btn btn-secondary btn-small" onclick="addToWishlist(${museum.id})">Add to Wishlist</button>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function searchMuseums() {
  const query = document.getElementById('searchInput').value;

  if (!query || query.trim() === '') {
    displayMuseums(museums);
    return;
  }

  fetch(`${API_BASE_URL}/museums/search/${encodeURIComponent(query)}`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('Search results:', data);
      if (data.success && data.museums) {
        displayMuseums(data.museums);
      } else if (Array.isArray(data)) {
        // Fallback for old format
        displayMuseums(data);
      } else {
        showAlert('No results found for: ' + query, 'info');
        displayMuseums([]);
      }
    })
    .catch(err => {
      console.error('Error searching museums:', err);
      showAlert('Error searching museums: ' + err.message, 'error');
    });
}

function showMuseumProfile(museumId) {
  const museum = museums.find(m => m.id === museumId);
  if (!museum) return;

  const profileContainer = document.getElementById('museumProfileContainer');
  if (!profileContainer) return;

  // Check if museum is already visited
  const isVisited = currentUser && currentUser.visitedLog && currentUser.visitedLog.some(v => v.museumId === museumId);

  let profileHTML = `
    <div class="museum-profile">
      <div class="museum-profile-header" style="background-image: url('${museum.museumImage || museumImages[museum.id] || 'images/museum-placeholder.svg'}'); background-size: cover; background-position: center; position: relative;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1;"></div>
        <div style="position: relative; z-index: 2;">
          <h1>${museum.name}</h1>
          <p>${museum.description}</p>
        </div>
      </div>
      <div class="museum-profile-body">
        <div class="profile-section">
          <h3>General Information</h3>
          <p><strong>Location:</strong> ${museum.city}, ${museum.state}</p>
          <p><strong>Address:</strong> ${museum.address}</p>
          <p><strong>Opening Hours:</strong> ${museum.openingHours}</p>
          <p><strong>Ticket Price:</strong> ${museum.ticketPrice}</p>
          ${museum.website ? `<p><strong>Website:</strong> <a href="${museum.website}" target="_blank">${museum.website}</a></p>` : ''}
          <p><strong>View on Map:</strong> <a href="https://www.google.com/maps/search/${encodeURIComponent(museum.address)}" target="_blank">📍 Open in Google Maps</a></p>
        </div>

        <div class="profile-section">
          <h3>About This Museum</h3>
          <div id="wikiInfo-${museumId}" style="padding: 1rem; line-height: 1.6; color: #333;">
            ${museum.aboutMuseum ? museum.aboutMuseum : 'Information about this museum is being loaded...'}
          </div>
        </div>

        <div class="profile-section">
          <h3>Top 5 Exhibits</h3>
          <div class="exhibit-grid">
  `;

  museum.topExhibits.forEach(exhibit => {
    profileHTML += `
      <div class="exhibit-card">
        <div class="exhibit-image">
          <img src="images/exhibit-placeholder.svg" alt="${exhibit.name}" style="width: 100%; height: 100%; object-fit: cover;"/>
        </div>
        <div class="exhibit-content">
          <h4>${exhibit.name}</h4>
          <p>${exhibit.description}</p>
        </div>
      </div>
    `;
  });

  profileHTML += `
          </div>
        </div>

        <div class="profile-section">
          <h3>📍 Mark as Visited</h3>
          <p style="margin-bottom: 1rem; color: #666;">Have you visited this museum? Mark it in your visited log!</p>
          ${isVisited ? `
            <div style="padding: 1rem; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px; color: #155724;">
              <p><strong>✓ Already Marked as Visited!</strong></p>
              <p style="font-size: 0.9rem; margin-top: 0.5rem;">You can view this museum in your visited log on your dashboard.</p>
            </div>
          ` : `
            <button class="btn btn-primary" onclick="addVisitedLog(${museum.id})" style="padding: 0.8rem 2rem; font-size: 1rem;">✓ Mark as Visited</button>
            <div id="visitedLog-${museumId}" style="margin-top: 1rem; padding: 1rem; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px; color: #155724; display: none;">
              <p><strong>✓ Added to Visited Log!</strong></p>
              <p style="color: #155724; font-size: 0.9rem; margin-top: 0.5rem;">You can now write a review about your experience below.</p>
            </div>
          `}
        </div>

        <div class="profile-section" id="reviewSection-${museumId}" style="display: ${isVisited ? 'block' : 'none'};">
          <h3>💬 Write a Review</h3>
          <div id="reviewForm-${museumId}">
            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Rate Your Experience (1-5 stars)</label>
              <div class="star-rating-profile" id="starRating-${museumId}">
                <span class="star" data-rating="1" onclick="selectRating(${museum.id}, 1)" style="cursor: pointer; font-size: 2rem; color: #ddd;">★</span>
                <span class="star" data-rating="2" onclick="selectRating(${museum.id}, 2)" style="cursor: pointer; font-size: 2rem; color: #ddd;">★</span>
                <span class="star" data-rating="3" onclick="selectRating(${museum.id}, 3)" style="cursor: pointer; font-size: 2rem; color: #ddd;">★</span>
                <span class="star" data-rating="4" onclick="selectRating(${museum.id}, 4)" style="cursor: pointer; font-size: 2rem; color: #ddd;">★</span>
                <span class="star" data-rating="5" onclick="selectRating(${museum.id}, 5)" style="cursor: pointer; font-size: 2rem; color: #ddd;">★</span>
              </div>
              <input type="hidden" id="selectedRating-${museum.id}" value="0">
            </div>
            <div style="margin-bottom: 1rem;">
              <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Your Experience & Notes</label>
              <textarea id="reviewDescription-${museum.id}" placeholder="Share your experience, favorite exhibits, tips for visitors, etc." style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px; font-family: inherit; font-size: 1rem; min-height: 150px;"></textarea>
            </div>
            <button class="btn btn-primary" onclick="submitMuseumReview(${museum.id})" style="padding: 0.8rem 2rem; font-size: 1rem;">Submit Review</button>
          </div>
          <div id="reviewSuccess-${museumId}" style="margin-top: 1rem; padding: 1rem; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px; color: #155724; display: none;">
            <p><strong>✓ Review submitted successfully!</strong></p>
            <p style="font-size: 0.9rem; margin-top: 0.5rem;">Your review has been added to your Review Diary.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  profileContainer.innerHTML = profileHTML;
  
  // Fetch Wikipedia information in real-time
  fetchMuseumInfo(museum.name, museumId);
  
  showPage('museum-profile');
}

// Fetch real-time museum information from Wikipedia
function fetchMuseumInfo(museumName, museumId) {
  const museum = museums.find(m => m.id === museumId);
  const infoDiv = document.getElementById(`wikiInfo-${museumId}`);
  
  // If aboutMuseum exists, use it and don't fetch from Wikipedia
  if (museum && museum.aboutMuseum && infoDiv) {
    infoDiv.innerHTML = `<p>${museum.aboutMuseum}</p>`;
    return;
  }
  
  // Otherwise try to fetch from Wikipedia
  fetch(`${API_BASE_URL}/museum-info/${encodeURIComponent(museumName)}`)
    .then(res => res.json())
    .then(data => {
      if (infoDiv) {
        if (data.success && data.information) {
          // Truncate to 500 characters for display
          const summary = data.information.substring(0, 500) + (data.information.length > 500 ? '...' : '');
          infoDiv.innerHTML = `<p>${summary}</p><p><a href="https://en.wikipedia.org/wiki/${encodeURIComponent(museumName)}" target="_blank">Read more on Wikipedia →</a></p>`;
          infoDiv.classList.remove('loading');
        } else {
          infoDiv.innerHTML = '<p>Information not available at this moment.</p>';
          infoDiv.classList.remove('loading');
        }
      }
    })
    .catch(err => {
      console.error('Error fetching museum info:', err);
      if (infoDiv) {
        infoDiv.innerHTML = '<p>Unable to load additional information.</p>';
        infoDiv.classList.remove('loading');
      }
    });
}

// Wishlist Functions
function addToWishlist(museumId) {
  if (!currentUser) {
    showAlert('Please login first', 'info');
    showPage('auth');
    return;
  }

  fetch(`${API_BASE_URL}/user/wishlist/${currentUser.username}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ museumId })
  })
    .then(res => res.json())
    .then(data => {
      showAlert('Added to wishlist!', 'success');
      loadDashboard();
    })
    .catch(err => showAlert('Error adding to wishlist', 'error'));
}

function removeFromWishlist(museumId) {
  if (!currentUser) return;

  fetch(`${API_BASE_URL}/user/wishlist/${currentUser.username}/${museumId}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(data => {
      showAlert('Removed from wishlist', 'success');
      loadDashboard();
    })
    .catch(err => showAlert('Error removing from wishlist', 'error'));
}

function addVisitedLog(museumId) {
  if (!currentUser) {
    showAlert('Please login first', 'info');
    return;
  }

  const visitDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

  fetch(`${API_BASE_URL}/user/visited/${currentUser.username}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ museumId, visitDate })
  })
    .then(res => res.json())
    .then(data => {
      // Update current user's visited log in memory
      if (!currentUser.visitedLog) {
        currentUser.visitedLog = [];
      }
      currentUser.visitedLog.push({ museumId, visitDate });
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      showAlert('✓ Added to your Visited Log! Now take the museum quiz...', 'success');
      // Show the visited log confirmation message
      document.getElementById(`visitedLog-${museumId}`).style.display = 'block';
      // Hide the mark as visited button
      const markVisitedBtn = document.querySelector(`button[onclick="addVisitedLog(${museumId})"]`);
      if (markVisitedBtn) {
        markVisitedBtn.style.display = 'none';
      }
      // Show the review section
      document.getElementById(`reviewSection-${museumId}`).style.display = 'block';
      loadDashboard();
      // Mandatory quiz after marking visited
      setTimeout(() => {
        loadMuseumQuizMandatory(museumId);
      }, 500);
    })
    .catch(err => showAlert('Error adding to visited log', 'error'));
}

// Review Functions - Profile Page
function selectRating(museumId, rating) {
  const ratingInput = document.getElementById(`selectedRating-${museumId}`);
  ratingInput.value = rating;
  
  // Update star appearance
  const stars = document.querySelectorAll(`#starRating-${museumId} .star`);
  stars.forEach((star, index) => {
    if (index < rating) {
      star.style.color = '#FFD700';
    } else {
      star.style.color = '#ddd';
    }
  });
}

function submitMuseumReview(museumId) {
  if (!currentUser) {
    showAlert('Please login first', 'info');
    return;
  }

  const rating = parseInt(document.getElementById(`selectedRating-${museumId}`).value);
  const description = document.getElementById(`reviewDescription-${museumId}`).value;

  if (rating === 0) {
    showAlert('Please select a rating', 'error');
    return;
  }

  if (!description.trim()) {
    showAlert('Please write your experience', 'error');
    return;
  }

  fetch(`${API_BASE_URL}/user/review/${currentUser.username}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      museumId,
      rating,
      notes: description
    })
  })
    .then(res => res.json())
    .then(data => {
      showAlert('✓ Review submitted successfully!', 'success');
      // Show success message
      document.getElementById(`reviewSection-${museumId}`).style.display = 'none';
      document.getElementById(`reviewSuccess-${museumId}`).style.display = 'block';
      loadDashboard();
    })
    .catch(err => {
      console.error('Error:', err);
      showAlert('Error submitting review', 'error');
    });
}

// Old Review Functions (kept for backwards compatibility)
let reviewMuseumId = null;

function showReviewForm(museumId) {
  reviewMuseumId = museumId;
  showPage('review-form');
}

function submitReview() {
  if (!currentUser) {
    showAlert('Please login first', 'info');
    return;
  }

  const rating = document.querySelector('.star.active')?.dataset.rating || 0;
  const notes = document.getElementById('reviewNotes').value;

  if (!rating || !notes) {
    showAlert('Please provide rating and notes', 'error');
    return;
  }

  fetch(`${API_BASE_URL}/user/review/${currentUser.username}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      museumId: reviewMuseumId,
      rating: parseInt(rating),
      notes
    })
  })
    .then(res => res.json())
    .then(data => {
      showAlert('Review submitted successfully!', 'success');
      document.getElementById('reviewForm').reset();
      document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
      loadDashboard();
      showPage('dashboard');
    })
    .catch(err => showAlert('Error submitting review', 'error'));
}

// Star Rating
function initStarRating() {
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => {
    star.addEventListener('click', function() {
      stars.forEach(s => s.classList.remove('active'));
      for (let i = 0; i < this.dataset.rating; i++) {
        stars[i].classList.add('active');
      }
    });
  });
}

// Dashboard Functions
function loadDashboard() {
  if (!currentUser) {
    console.warn('No current user to load dashboard');
    return;
  }

  fetch(`${API_BASE_URL}/user/dashboard/${currentUser.username}`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (data) {
        displayDashboard(data);
      }
    })
    .catch(err => {
      console.error('Error loading dashboard:', err);
      showAlert('Error loading dashboard', 'error');
    });
}

function displayDashboard(userData) {
  // Display Wishlist
  const wishlistContainer = document.getElementById('wishlistContainer');
  if (wishlistContainer) {
    if (userData.wishlist.length === 0) {
      wishlistContainer.innerHTML = '<p class="text-center">No museums in your wishlist yet.</p>';
    } else {
      wishlistContainer.innerHTML = `
        <ul class="dashboard-list">
          ${userData.wishlist.map(item => {
            const museum = museums.find(m => m.id === item.museumId);
            return `
              <li class="dashboard-item">
                <div>
                  <h4>${museum ? museum.name : 'Unknown Museum'}</h4>
                  <p class="visit-date">Added: ${new Date(item.addedDate).toLocaleDateString()}</p>
                </div>
                <div class="dashboard-item-actions">
                  <button class="btn btn-danger btn-small" onclick="removeFromWishlist(${item.museumId})">Remove</button>
                </div>
              </li>
            `;
          }).join('')}
        </ul>
      `;
    }
  }

  // Display Visited Log
  const visitedContainer = document.getElementById('visitedContainer');
  if (visitedContainer) {
    if (userData.visitedLog.length === 0) {
      visitedContainer.innerHTML = '<p class="text-center">No visits recorded yet.</p>';
    } else {
      visitedContainer.innerHTML = `
        <ul class="dashboard-list">
          ${userData.visitedLog.map(item => {
            const museum = museums.find(m => m.id === item.museumId);
            return `
              <li class="dashboard-item">
                <div>
                  <h4>${museum ? museum.name : 'Unknown Museum'}</h4>
                  <p class="visit-date">Visited: ${new Date(item.visitDate).toLocaleDateString()}</p>
                </div>
              </li>
            `;
          }).join('')}
        </ul>
      `;
    }
  }

  // Display Review Diary
  const reviewContainer = document.getElementById('reviewContainer');
  if (reviewContainer) {
    if (userData.reviewDiary.length === 0) {
      reviewContainer.innerHTML = '<p class="text-center">No reviews yet.</p>';
    } else {
      reviewContainer.innerHTML = `
        <ul class="dashboard-list">
          ${userData.reviewDiary.map(item => {
            const museum = museums.find(m => m.id === item.museumId);
            return `
              <li class="dashboard-item">
                <div>
                  <h4>${museum ? museum.name : 'Unknown Museum'}</h4>
                  <div class="review-rating">${'⭐'.repeat(item.rating)}</div>
                  <p>${item.notes}</p>
                  <p class="visit-date">Reviewed: ${new Date(item.reviewDate).toLocaleDateString()}</p>
                </div>
              </li>
            `;
          }).join('')}
        </ul>
      `;
    }
  }

  // Display Quiz Score History
  const scoreHistoryContainer = document.getElementById('scoreHistoryContainer');
  if (scoreHistoryContainer) {
    if (!userData.quizScores || userData.quizScores.length === 0) {
      scoreHistoryContainer.innerHTML = '<p class="text-center">No quizzes completed yet. Visit a museum and take a quiz!</p>';
    } else {
      scoreHistoryContainer.innerHTML = `
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead style="background-color: #f5f5f5; border-bottom: 2px solid #8B4513;">
              <tr>
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Museum / Quiz</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #ddd;">Score</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #ddd;">Percentage</th>
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Date</th>
              </tr>
            </thead>
            <tbody>
              ${userData.quizScores.map(score => {
                const museum = museums.find(m => m.id === score.museumId);
                const museumName = museum ? museum.name : (score.museumName || 'Unknown Museum');
                const percentage = score.percentage || ((score.score / score.totalQuestions * 100).toFixed(2));
                const passStatus = percentage >= 70 ? '✓ Pass' : '✗ Need Practice';
                const statusColor = percentage >= 70 ? '#28a745' : '#dc3545';
                return `
                  <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 0.75rem; border: 1px solid #ddd;">${museumName}</td>
                    <td style="padding: 0.75rem; border: 1px solid #ddd; text-align: center; font-weight: bold;">${score.score}/${score.totalQuestions}</td>
                    <td style="padding: 0.75rem; border: 1px solid #ddd; text-align: center;"><span style="color: ${statusColor}; font-weight: bold;">${percentage}% ${passStatus}</span></td>
                    <td style="padding: 0.75rem; border: 1px solid #ddd;">${new Date(score.attemptDate).toLocaleDateString()}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  }
}

// Quiz Functions
function loadQuiz() {
  const container = document.getElementById('quizContainer');
  if (!container) return;

  // Handle case where user is not logged in
  if (!currentUser) {
    container.innerHTML = '<p style="text-align: center; color: #666; font-size: 1.1rem;">Please login to take quizzes.</p>';
    return;
  }

  // Fetch user's visited museums from dashboard
  fetch(`${API_BASE_URL}/user/dashboard/${currentUser.username}`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('Dashboard data:', data);
      if (data && data.visitedLog && data.visitedLog.length > 0) {
        displayMuseumSelection(data.visitedLog);
      } else {
        container.innerHTML = '<p style="text-align: center; color: #666; font-size: 1.1rem;">No visited museums yet! Visit a museum first to take its quiz.</p>';
      }
    })
    .catch(err => {
      console.error('Error loading visited museums:', err);
      container.innerHTML = '<p style="text-align: center; color: #999; font-size: 1.1rem;">Error loading quiz selection. Please try again.</p>';
    });
}

function displayMuseumSelection(visitedLog) {
  const container = document.getElementById('quizContainer');
  if (!container) return;

  let html = '<div style="max-width: 700px; margin: 0 auto;">';
  html += '<h3 style="text-align: center; margin-bottom: 2rem; color: #8B4513;">Select a Museum to Take Its Quiz</h3>';
  html += '<div class="museum-quiz-grid">';

  visitedLog.forEach(visit => {
    const museum = museums.find(m => m.id === visit.museumId);
    if (museum) {
      html += `
        <div class="museum-quiz-card" onclick="loadMuseumQuiz(${museum.id})">
          <h4>${museum.name}</h4>
          <p>${museum.city}, ${museum.state}</p>
          <p style="color: #8B4513; font-weight: bold;">📝 Take 10-Question Quiz</p>
          <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Start Quiz</button>
        </div>
      `;
    }
  });

  html += '</div></div>';
  container.innerHTML = html;
}

function loadMuseumQuiz(museumId) {
  fetch(`${API_BASE_URL}/museum-quiz/${museumId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success && data.quiz) {
        displayMuseumQuiz(data.quiz, museumId);
      } else {
        showAlert('Quiz not available for this museum', 'error');
      }
    })
    .catch(err => {
      console.error('Error loading museum quiz:', err);
      showAlert('Error loading museum quiz: ' + err.message, 'error');
    });
}

function loadMuseumQuizMandatory(museumId) {
  console.log('Loading mandatory quiz for museum:', museumId);
  fetch(`${API_BASE_URL}/museum-quiz/${museumId}`)
    .then(res => res.json())
    .then(data => {
      console.log('Quiz data received:', data);
      if (data.success && data.quiz) {
        console.log('Showing quiz page');
        showPage('quiz');
        displayMuseumQuizMandatory(data.quiz, museumId);
      } else {
        console.error('Quiz response failed:', data);
        showAlert('Quiz not available for this museum', 'error');
      }
    })
    .catch(err => {
      console.error('Error loading mandatory quiz:', err);
      showAlert('Error loading quiz: ' + err.message, 'error');
    });
}

function displayMuseumQuiz(quiz, museumId) {
  const container = document.getElementById('quizContainer');
  if (!container || !quiz.questions) return;

  const museum = museums.find(m => m.id === museumId);
  let quizHTML = `<div style="max-width: 800px; margin: 0 auto;">`;
  quizHTML += `<h3 style="color: #8B4513; margin-bottom: 1rem;">${museum.name}</h3>`;
  quizHTML += `<p style="color: #666; margin-bottom: 2rem;">${quiz.questions.length} Questions about this museum's history and exhibits</p>`;
  quizHTML += '<form id="quizForm">';
  
  quiz.questions.forEach((question, index) => {
    quizHTML += `
      <div class="quiz-question">
        <h4>Q${index + 1}: ${question.question}</h4>
        <ul class="quiz-options">
          ${question.options.map((option, optIndex) => `
            <li class="quiz-option">
              <input type="radio" id="mq${museumId}_q${question.id}_opt${optIndex}" name="mq${question.id}" value="${optIndex}" required>
              <label for="mq${museumId}_q${question.id}_opt${optIndex}">${option}</label>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  });

  quizHTML += `<button type="button" class="btn btn-primary" onclick="submitMuseumQuiz(${museumId})">Submit Quiz</button>`;
  quizHTML += '<button type="button" class="btn btn-secondary" onclick="loadQuiz()" style="margin-left: 1rem;">Back to Museums</button>';
  quizHTML += '</form></div>';
  container.innerHTML = quizHTML;
}

function displayMuseumQuizMandatory(quiz, museumId) {
  const container = document.getElementById('quizContainer');
  if (!container) {
    console.error('Quiz container not found');
    return;
  }
  
  if (!quiz.questions) {
    console.error('Quiz questions not found');
    return;
  }

  const museum = museums.find(m => m.id === museumId);
  const museumName = museum ? museum.name : (quiz.museumName || 'Museum');
  
  console.log('Displaying mandatory quiz for:', museumName);
  
  let quizHTML = `<div style="max-width: 800px; margin: 0 auto;">`;
  quizHTML += `<h3 style="color: #8B4513; margin-bottom: 1rem;">${museumName}</h3>`;
  quizHTML += `<p style="color: #D2691E; margin-bottom: 1rem; font-weight: bold;">📋 Complete this quiz to finish marking your visit</p>`;
  quizHTML += `<p style="color: #666; margin-bottom: 2rem;">${quiz.questions.length} Questions about this museum's history and exhibits</p>`;
  quizHTML += '<form id="quizForm">';
  
  quiz.questions.forEach((question, index) => {
    quizHTML += `
      <div class="quiz-question">
        <h4>Q${index + 1}: ${question.question}</h4>
        <ul class="quiz-options">
          ${question.options.map((option, optIndex) => `
            <li class="quiz-option">
              <input type="radio" id="mq${museumId}_q${question.id}_opt${optIndex}" name="mq${question.id}" value="${optIndex}" required>
              <label for="mq${museumId}_q${question.id}_opt${optIndex}">${option}</label>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  });

  quizHTML += `<button type="button" class="btn btn-primary" onclick="submitMuseumQuiz(${museumId})">Complete Quiz</button>`;
  quizHTML += '</form></div>';
  
  console.log('Setting quiz HTML');
  container.innerHTML = quizHTML;
}

function submitMuseumQuiz(museumId) {
  if (!currentUser) {
    showAlert('Please login first', 'info');
    showPage('auth');
    return;
  }

  const museum = museums.find(m => m.id === museumId);
  if (!museum) {
    showAlert('Museum not found', 'error');
    return;
  }

  fetch(`${API_BASE_URL}/museum-quiz/${museumId}`)
    .then(res => res.json())
    .then(data => {
      if (!data.success || !data.quiz) throw new Error('Could not load quiz for scoring');
      
      const quiz = data.quiz;
      let score = 0;
      const answers = [];

      // Calculate score once
      quiz.questions.forEach(question => {
        const selected = document.querySelector(`input[name="mq${question.id}"]:checked`);
        if (selected) {
          const selectedIndex = parseInt(selected.value);
          answers.push({
            questionId: question.id,
            selectedAnswer: selectedIndex,
            correctAnswer: question.correctAnswer
          });
          if (selectedIndex === question.correctAnswer) {
            score++;
          }
        }
      });

      const percentage = (score / quiz.questions.length * 100).toFixed(2);

      // Save quiz score and display results in one chain
      return fetch(`${API_BASE_URL}/user/quiz-score/${currentUser.username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          museumId,
          museumName: museum.name,
          score,
          totalQuestions: quiz.questions.length,
          percentage,
          answers
        })
      }).then(res => res.json()).then(() => {
        // Display results using calculated score (no re-fetching)
        const container = document.getElementById('quizContainer');
        if (!container) return;
        
        container.innerHTML = `
          <div style="max-width: 600px; margin: 0 auto; text-align: center; padding: 2rem; background: #f9f9f9; border-radius: 8px;">
            <h2 style="color: #8B4513; margin-bottom: 1rem;">✓ Quiz Completed!</h2>
            <h3 style="color: #666; margin-bottom: 2rem;">${museum.name}</h3>
            <div style="background: white; padding: 2rem; border-radius: 8px; margin-bottom: 2rem;">
              <p style="font-size: 2rem; color: #8B4513; margin: 0;">Your Score: <strong>${score}/${quiz.questions.length}</strong></p>
              <p style="font-size: 1.3rem; color: #666; margin-top: 0.5rem;"><strong>${percentage}%</strong></p>
            </div>
            <button class="btn btn-primary" onclick="loadQuiz()">Take Another Quiz</button>
            <button class="btn btn-secondary" onclick="showPage('dashboard'); loadDashboard();" style="margin-left: 1rem;">Go to Dashboard</button>
          </div>
        `;
      });
    })
    .catch(err => {
      console.error('Error:', err);
      showAlert('Error submitting quiz: ' + err.message, 'error');
    });
}

// Old general quiz functions (kept for compatibility)
function displayQuiz() {
  // Museum-specific quiz is now primary
  return;
}

function submitQuiz() {
  // Museum-specific quiz is now primary
  return;
}

function displayQuizResult(score, total, percentage) {
  // Museum-specific quiz is now primary
  return;
}

// Alert Function
function showAlert(message, type) {
  const alertsContainer = document.getElementById('alerts');
  if (!alertsContainer) return;

  const alertHTML = `
    <div class="alert alert-${type}">
      ${message}
      <span style="float: right; cursor: pointer;" onclick="this.parentElement.remove()">✕</span>
    </div>
  `;

  alertsContainer.innerHTML += alertHTML;

  // Auto remove after 5 seconds
  setTimeout(() => {
    const alerts = alertsContainer.querySelectorAll('.alert');
    if (alerts.length > 0) {
      alerts[alerts.length - 1].remove();
    }
  }, 5000);
}

// Initialization
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    // Load user data and show home
    loadMuseums();
    loadQuiz();
    showPage('home');
  } else {
    // Show auth page if not logged in
    showPage('auth');
  }

  updateNavigation();

  // Initialize star rating
  setTimeout(() => initStarRating(), 100);

  // Search functionality
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', searchMuseums);
  }

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        searchMuseums();
      }
    });
  }
});
