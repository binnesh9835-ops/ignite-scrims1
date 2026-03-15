window.addEventListener("DOMContentLoaded", () => {
  const usernamePopup = document.getElementById("usernamePopup");
  const newUsernameInput = document.getElementById("newUsername");
  const confirmUsernameBtn = document.getElementById("confirmUsernameBtn");

  const profileSection = document.getElementById("profile");
  const usernameInput = document.getElementById("username");
  const ignInput = document.getElementById("ign");
  const ffUidInput = document.getElementById("ffuid");
  const ffLevelInput = document.getElementById("fflevel");
  const xpDisplay = document.getElementById("xpLevel");
  const madeChangesBtn = profileSection.querySelector("button[onclick='saveProfile()']");
  const logoutBtn = profileSection.querySelector("button[onclick='logoutUser()']");

  // Confirm Username popup (1 time for players)
  confirmUsernameBtn.addEventListener("click", () => {
    let username = newUsernameInput.value.trim();

    if (username === ""  username.includes(" ")  /[^a-z0-9]/.test(username) || username.length > 12) {
      alert("Username must be lowercase letters & numbers only, no spaces, max 12 chars");
      return;
    }

    localStorage.setItem("username", username);

    // Update top-right login button
    const loginBtn = document.getElementById("loginBtn");
    loginBtn.textContent = username;
    loginBtn.style.pointerEvents = "none";

    usernamePopup.style.display = "none";
    profileSection.classList.remove("profileLocked");

    // Pre-fill profile inputs
    usernameInput.value = username;
    ignInput.value = "";
    ffUidInput.value = "";
    ffLevelInput.value = "";
    xpDisplay.textContent = "0";
  });

  // Save profile changes
  madeChangesBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const ign = ignInput.value.trim();
    const ffuid = ffUidInput.value.trim();
    const fflevel = ffLevelInput.value.trim();
    let xp = parseInt(localStorage.getItem("xp")) || 0;

    if (username === ""  username.includes(" ")  /[^a-z0-9]/.test(username) || username.length > 12) {
      alert("Username must be lowercase letters & numbers only, no spaces, max 12 chars");
      return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("ign", ign);
    localStorage.setItem("ffuid", ffuid);
    localStorage.setItem("fflevel", fflevel);
    localStorage.setItem("xp", xp);

    const loginBtn = document.getElementById("loginBtn");
    loginBtn.textContent = username;
    loginBtn.style.pointerEvents = "none";

    alert("Profile updated successfully!");

    // XP shine effect
    if (xp >= 7000) usernameInput.classList.add("shine-effect");
    else usernameInput.classList.remove("shine-effect");
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    if (!confirm("Are you sure you want to logout?")) return;

    // Clear localStorage
    const keys = ["username","ign","ffuid","fflevel","xp","userEmail","userRole","displayName"];
    keys.forEach(k => localStorage.removeItem(k));

    // Reset profile inputs
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

  // Pre-fill profile on reload
  const role = localStorage.getItem("userRole");
  if (role === "player") {
    const username = localStorage.getItem("username");
    if (username) {
      usernameInput.value = username;
      ignInput.value = localStorage.getItem("ign") || "";
      ffUidInput.value = localStorage.getItem("ffuid") || "";
      ffLevelInput.value = localStorage.getItem("fflevel") || "";
      xpDisplay.textContent = localStorage.getItem("xp") || "0";
      profileSection.classList.remove("profileLocked");

    if ((parseInt(localStorage.getItem("xp")) || 0) >= 7000) {
        usernameInput.classList.add("shine-effect");
      }
    }
  } else if (role === "admin" || role === "owner") {
    const displayName = localStorage.getItem("displayName");
    const loginBtn = document.getElementById("loginBtn");
    loginBtn.textContent = displayName;
    loginBtn.style.pointerEvents = "none";
    profileSection.classList.add("profileLocked");
  }
});
