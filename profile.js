import { logoutUser } from "./auth.js";

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
  const saveBtn = profileSection.querySelector("button[onclick='saveProfile()']");
  const logoutBtn = profileSection.querySelector("button[onclick='logoutUser()']");

  // --- Username creation after login (Player only) ---
  confirmUsernameBtn.addEventListener("click", () => {
    const username = newUsernameInput.value.trim();

    // Validation: lowercase letters, numbers, max 12 chars, no spaces/special chars
    if (!/^[a-z0-9]{1,12}$/.test(username)) {
      alert("Username must be 1-12 characters, lowercase letters & numbers only, no spaces/special chars");
      return;
    }

    // Save in localStorage
    localStorage.setItem("username", username);

    // Update top-right display
    const loginBtn = document.getElementById("loginBtn");
    loginBtn.textContent = username;
    loginBtn.style.pointerEvents = "none";

    usernamePopup.style.display = "none";

    // Unlock profile section
    profileSection.classList.remove("profileLocked");

    // Pre-fill profile fields
    usernameInput.value = username;
    ignInput.value = "";
    ffUidInput.value = "";
    ffLevelInput.value = "";
    xpDisplay.textContent = "0";
  });

  // --- Save profile changes ---
  saveBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const ign = ignInput.value.trim();
    const ffuid = ffUidInput.value.trim();
    const fflevel = ffLevelInput.value.trim();
    let xp = parseInt(localStorage.getItem("xp")) || 0;

    if (!/^[a-z0-9]{1,12}$/.test(username)) {
      alert("Username must be 1-12 characters, lowercase letters & numbers only, no spaces/special chars");
      return;
    }

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

    // XP shine effect if >=7000
    if (xp >= 7000) {
      usernameInput.classList.add("shine-effect");
    } else {
      usernameInput.classList.remove("shine-effect");
    }
  });

  // --- Logout button ---
  logoutBtn.addEventListener("click", () => {
    logoutUser(); // calls auth.js logout
  });

  // --- Pre-fill profile if user reloads page ---
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
    } else {
      // username not set yet → show popup
      usernamePopup.style.display = "flex";
}
  } else if (role === "admin" || role === "owner") {
    // Admin/Owner: only displayName top-right, profile locked
    const displayName = localStorage.getItem("displayName");
    const loginBtn = document.getElementById("loginBtn");
    loginBtn.textContent = displayName;
    loginBtn.style.pointerEvents = "none";
    profileSection.classList.add("profileLocked");
  }
});
