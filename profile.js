// profile.js
window.addEventListener("DOMContentLoaded", () => {

  const usernamePopup = document.getElementById("usernamePopup");
  const newUsernameInput = document.getElementById("newUsername");
  const confirmUsernameBtn = document.querySelector("#usernamePopup button");

  const profileSection = document.getElementById("profile");
  const usernameInput = document.getElementById("username");
  const ignInput = document.getElementById("ign");
  const ffUidInput = document.getElementById("ffuid");
  const ffLevelInput = document.getElementById("fflevel");
  const xpDisplay = document.getElementById("xpLevel");
  const madeChangesBtn = profileSection.querySelector("button[onclick='saveProfile()']");
  const logoutBtn = profileSection.querySelector("button[onclick='logoutUser()']");

  // Show username popup after Google login if not set (Player only)
  confirmUsernameBtn.addEventListener("click", () => {
    let username = newUsernameInput.value.trim();
    if(username === ""  username.includes(" ")  /[^a-z]/.test(username)) {
      alert("Username must be lowercase letters only and cannot contain spaces");
      return;
    }

    // Save in localStorage
    localStorage.setItem("username", username);

    // Update top-right display
    const loginBtn = document.getElementById("loginBtn");
    loginBtn.textContent = username;
    loginBtn.style.pointerEvents = "none"; // disable click

    usernamePopup.style.display = "none";

    // Unlock profile section
    profileSection.classList.remove("profileLocked");

    // Pre-fill profile inputs
    usernameInput.value = username;
    ignInput.value = "";
    ffUidInput.value = "";
    ffLevelInput.value = "";
    xpDisplay.textContent = "0";
  });

  // Made Changes button (profile save)
  madeChangesBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const ign = ignInput.value.trim();
    const ffuid = ffUidInput.value.trim();
    const fflevel = ffLevelInput.value.trim();
    let xp = parseInt(localStorage.getItem("xp")) || 0;

    if(username === ""  username.includes(" ")  /[^a-z]/.test(username)) {
      alert("Username must be lowercase letters only and cannot contain spaces");
      return;
    }

    // Save in localStorage
    localStorage.setItem("username", username);
    localStorage.setItem("ign", ign);
    localStorage.setItem("ffuid", ffuid);
    localStorage.setItem("fflevel", fflevel);
    localStorage.setItem("xp", xp);

    // Update top-right display
    const loginBtn = document.getElementById("loginBtn");
    loginBtn.textContent = username;
    loginBtn.style.pointerEvents = "none";

    alert("Profile updated successfully!");

    // Shine effect for XP >= 7000
    if(xp >= 7000) {
      usernameInput.classList.add("shine-effect");
    } else {
      usernameInput.classList.remove("shine-effect");
    }
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    if(!confirm("Are you sure you want to logout?")) return;

    // Clear localStorage
    localStorage.removeItem("username");
    localStorage.removeItem("ign");
    localStorage.removeItem("ffuid");
    localStorage.removeItem("fflevel");
    localStorage.removeItem("xp");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("displayName");

    // Reset profile section
    usernameInput.value = "";
    ignInput.value = "";
    ffUidInput.value = "";
    ffLevelInput.value = "";
    xpDisplay.textContent = "0";
    profileSection.classList.add("profileLocked");

    // Reset top-right display
    const loginBtn = document.getElementById("loginBtn");
    loginBtn.textContent = "Login";
    loginBtn.style.pointerEvents = "auto";

    // Hide username popup if open
    usernamePopup.style.display = "none";

    alert("You have been logged out");
  });

                        // Pre-fill profile if user reloads page
  const role = localStorage.getItem("userRole");
  if(role === "player") {
    const username = localStorage.getItem("username");
    if(username) {
      usernameInput.value = username;
      ignInput.value = localStorage.getItem("ign") || "";
      ffUidInput.value = localStorage.getItem("ffuid") || "";
      ffLevelInput.value = localStorage.getItem("fflevel") || "";
      xpDisplay.textContent = localStorage.getItem("xp") || "0";
      profileSection.classList.remove("profileLocked");

      // Shine effect for XP >= 7000
      if(parseInt(localStorage.getItem("xp")) >= 7000) {
        usernameInput.classList.add("shine-effect");
      }
    }
  } else if(role === "admin" || role === "owner") {
    // Admin/Owner: only show displayName in top-right, profile locked
    const displayName = localStorage.getItem("displayName");
    const loginBtn = document.getElementById("loginBtn");
    loginBtn.textContent = displayName;
    loginBtn.style.pointerEvents = "none";
    profileSection.classList.add("profileLocked");
  }

});
