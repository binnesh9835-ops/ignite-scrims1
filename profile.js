// profile.js
window.addEventListener("DOMContentLoaded", () => {
  const profileSection = document.getElementById("profile");
  const usernameInput = document.getElementById("username");
  const ignInput = document.getElementById("ign");
  const ffUidInput = document.getElementById("ffuid");
  const ffLevelInput = document.getElementById("fflevel");
  const xpDisplay = document.getElementById("xpLevel");

  const saveBtn = profileSection.querySelector("button[onclick='saveProfile()']");
  const logoutBtn = profileSection.querySelector("button[onclick='logoutUser()']");

  // Pre-fill profile from localStorage
  function loadProfile() {
    const role = localStorage.getItem("userRole");
    if (!role) return;

    if (role === "player") {
      usernameInput.value = localStorage.getItem("username") || "";
      ignInput.value = localStorage.getItem("ign") || "";
      ffUidInput.value = localStorage.getItem("ffuid") || "";
      ffLevelInput.value = localStorage.getItem("fflevel") || "";
      xpDisplay.textContent = localStorage.getItem("xp") || "0";
      profileSection.classList.remove("profileLocked");
    } else {
      usernameInput.value = localStorage.getItem("displayName") || "";
      profileSection.classList.add("profileLocked");
    }
  }

  loadProfile();

  // Save Profile
  saveBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const ign = ignInput.value.trim();
    const ffuid = ffUidInput.value.trim();
    const fflevel = ffLevelInput.value.trim();
    const xp = parseInt(localStorage.getItem("xp")) || 0;

    if (!username  username.includes(" ")  /[^a-z0-9]/.test(username)) {
      alert("Username must be lowercase letters, numbers allowed, no spaces or special chars");
      return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("ign", ign);
    localStorage.setItem("ffuid", ffuid);
    localStorage.setItem("fflevel", fflevel);
    localStorage.setItem("xp", xp);

    alert("Profile updated successfully!");
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    if (!confirm("Are you sure you want to logout?")) return;

    // Clear all user data
    ["username","ign","ffuid","fflevel","xp","userEmail","userRole","displayName"].forEach(k => localStorage.removeItem(k));

    // Reset top-right display
    const loginBtn = document.getElementById("loginBtn");
    loginBtn.textContent = "Login";
    loginBtn.style.pointerEvents = "auto";

    // Reset profile section
    usernameInput.value = "";
    ignInput.value = "";
    ffUidInput.value = "";
    ffLevelInput.value = "";
    xpDisplay.textContent = "0";
    profileSection.classList.add("profileLocked");

    alert("You have been logged out");
  });
});
