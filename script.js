// ==========================================================================
// 1. DAILY RECIPE BANNER (24-Hour Randomizer - Authentic Filipino Recipes)
// ==========================================================================
const RECIPE_POOL = [
  {
    title: "Classic Chicken & Pork Adobo",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Pork Sinigang na Sampalok",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Special Pinakbet Tagalog with Bagnet",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Crispy Lumpiang Shanghai",
    image: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Spicy Bicol Express na may Gata",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Savoury Beef Kare-Kare with Bagoong",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Sizzling Pork Sisig with Egg",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Rich & Savoury Beef Caldereta",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
  }
];

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

function updateDailyRecipe() {
  const recipeImg = document.getElementById('daily-recipe-img');
  const recipeSubtitle = document.getElementById('daily-recipe-subtitle');
  const heroBanner = document.getElementById('hero-banner');

  const now = new Date().getTime();
  const storedData = localStorage.getItem('freshbites_daily_filipino_recipe');

  let currentRecipe = null;

  if (storedData) {
    try {
      const parsed = JSON.parse(storedData);
      if (now - parsed.timestamp < TWENTY_FOUR_HOURS_MS) {
        currentRecipe = parsed.recipe;
      }
    } catch (e) {
      console.error("Error loading cached recipe", e);
    }
  }

  if (!currentRecipe) {
    const randomIndex = Math.floor(Math.random() * RECIPE_POOL.length);
    currentRecipe = RECIPE_POOL[randomIndex];

    localStorage.setItem('freshbites_daily_filipino_recipe', JSON.stringify({
      recipe: currentRecipe,
      timestamp: now
    }));
  }

  if (recipeImg) {
    recipeImg.src = currentRecipe.image;
    recipeImg.alt = currentRecipe.title;
  }
  if (recipeSubtitle) {
    recipeSubtitle.textContent = currentRecipe.title;
  }
  if (heroBanner) {
    heroBanner.style.backgroundImage = `url('${currentRecipe.image}')`;
  }
}

// ==========================================================================
// 2. PASSWORD TOGGLE
// ==========================================================================
function togglePassword(inputId, buttonElement) {
  const input = document.getElementById(inputId);
  const icon = buttonElement.querySelector('i');

  if (input) {
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  }
}

// Run daily recipe check on page load
document.addEventListener('DOMContentLoaded', updateDailyRecipe);

// ==========================================================================
// ACCOUNT STORAGE & AUTHENTICATION
// ==========================================================================

// 1. Pre-load a default demo account if no accounts exist yet
if (!localStorage.getItem('freshbites_users')) {
  const defaultUser = [{ name: "Juan Dela Cruz", email: "user@freshbites.ph", password: "password123" }];
  localStorage.setItem('freshbites_users', JSON.stringify(defaultUser));
}

// 2. Handle Sign Up (Saves new user account to browser storage)
function handleSignup(event) {
  event.preventDefault();

  const nameInput = document.getElementById('signup-name');
  const emailInput = document.getElementById('signup-email');
  const passwordInput = document.getElementById('signup-password');
  const confirmPasswordInput = document.getElementById('signup-confirm-password');

  if (!nameInput || !emailInput || !passwordInput) return;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : password;

  if (password !== confirmPassword) {
    alert("Passwords do not match! Please try again.");
    return;
  }

  // Get current users from LocalStorage
  const users = JSON.parse(localStorage.getItem('freshbites_users')) || [];

  // Check if email already exists
  if (users.some(user => user.email === email)) {
    alert("An account with this email already exists! Please sign in.");
    return;
  }

  // Save new user account
  users.push({ name, email, password });
  localStorage.setItem('freshbites_users', JSON.stringify(users));

  // Save current active user session
  localStorage.setItem('freshbites_current_user', JSON.stringify({ name, email }));

  alert("Account created successfully!");
  
  // REDIRECT TO YOUR LANDING PAGE (Change 'index.html' if your landing page has a different filename)
  window.location.href = 'index.html'; 
}

// 3. Handle Sign In (Checks entered credentials against stored accounts)
function handleLogin(event) {
  event.preventDefault();

  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');

  if (!emailInput || !passwordInput) return;

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  // Get stored users from LocalStorage
  const users = JSON.parse(localStorage.getItem('freshbites_users')) || [];

  // Find matching account
  const foundUser = users.find(user => user.email === email && user.password === password);

  if (foundUser) {
    // Save current active user session
    localStorage.setItem('freshbites_current_user', JSON.stringify({ name: foundUser.name, email: foundUser.email }));

    // REDIRECT TO YOUR LANDING PAGE (Change 'index.html' if your landing page has a different filename)
    window.location.href = 'Main/index.html';
  } else {
    alert("Invalid email or password!\n\nDemo test account:\nEmail: user@freshbites.ph\nPassword: password123");
  }
}

// 4. Automatically attach submit handlers when page loads
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
});