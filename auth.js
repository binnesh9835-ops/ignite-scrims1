import { auth, provider } from "./firebase.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Owner & Admin emails
let owner = "vishalpandey25288@gmail.com";
let admins = ["vmtournament20@gmail.com"];

// Function to check localStorage for existing username
function getUsername() {
  return localStorage.getItem("username") || null;
}

// Function to save role globally
function setRole(role) {
  localStorage.setItem("role", role);
}

// Google Login
window.addEventListener("DOMContentLoaded", () => {
  const googleBtn = document.getElementById("googleLogin");

  googleBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email;
      let role = "player";

      if (email === owner) role = "owner";
      else if (admins.includes(email)) role = "admin";

      setRole(role); // Save role in localStorage

      // Hide login popup
      document.getElementById("loginPopup").style.display = "none";

      // Update login button to show username/email
      updateLoginButton(user.displayName);

      // Show respective panel
      if (role === "owner") showOwnerPanel(user);
      else if (role === "admin") showAdminPanel(user);
      else {
        // PLAYER
        if (!getUsername()) {
          // Show username creation popup
          document.getElementById("usernamePopup").style.display = "flex";
        } else {
          showPlayerPanel(user);
        }
      }

    } catch (error) {
      alert(error.message);
    }
  });
});

// Update login button to show user name
function updateLoginButton(name) {
  const btn = document.getElementById("loginBtn");
  btn.style.display = "none";

  const nameDisplay = document.createElement("span");
  nameDisplay.id = "userDisplay";
  nameDisplay.style.position = "absolute";
  nameDisplay.style.top = "20px";
  nameDisplay.style.right = "20px";
  nameDisplay.style.fontWeight = "bold";
  nameDisplay.textContent = name;

  document.body.appendChild(nameDisplay);
}

/* OWNER PANEL */
function showOwnerPanel(user) {
  console.log("Owner Panel Enabled");
  // Owner profile logic: show only logout button
  unlockProfile(false);
}

/* ADMIN PANEL */
function showAdminPanel(user) {
  console.log("Admin Panel Enabled");
  // Admin profile logic: show only logout button
  unlockProfile(false);
}

/* PLAYER PANEL */
function showPlayerPanel(user) {
  console.log("Player Panel Enabled");
  // Player profile logic: enable profile fields
  unlockProfile(true);
}

// Enable or disable profile fields
function unlockProfile(isPlayer) {
  const profileSection = document.getElementById("profile");
  profileSection.classList.remove("profileLocked");

  if (isPlayer) {
    profileSection.querySelectorAll("input").forEach(inp => inp.disabled = false);
    profileSection.querySelector("button[onclick='saveProfile()']").disabled = false;
  } else {
    profileSection.querySelectorAll("input").forEach(inp => inp.disabled = true);
    profileSection.querySelector("button[onclick='saveProfile()']").disabled = true;
  }
}

/* Close login popup */
function closeLogin() {
  document.getElementById("loginPopup").style.display = "none";
}

// LOGOUT function
window.logoutUser = function() {
  localStorage.clear();
  // Reload page to reset
  location.reload();
};
