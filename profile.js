// profile.js
window.addEventListener("DOMContentLoaded", () => {

  // Elements
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

  const loginBtnTop = document.getElementById("loginBtn");

  // -----------------------------
  // CONFIRM USERNAME (PLAYER)
  // -----------------------------
  confirmUsernameBtn.addEventListener("click", () => {
    let username = newUsernameInput.value.trim();

    if(username === ""  username.includes(" ")  /[^a-z]/.test(username)){
      alert("Username must be lowercase letters only and cannot contain spaces");
      return;
    }

    // Save username in localStorage
    localStorage.setItem("username", username);

    // Update top-right display
    loginBtnTop.textContent = username;
    loginBtnTop.style.pointerEvents = "none";

    // Hide popup
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

  // -----------------------------
  // SAVE PROFILE CHANGES
  // -----------------------------
  madeChangesBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const ign = ignInput.value.trim();
    const ffuid = ffUidInput.value.trim();
    const fflevel = ffLevelInput.value.trim();
    let xp = parseInt(localStorage.getItem("xp")) || 0;

    if(username === ""  username.includes(" ")  /[^a-z]/.test(username)){
      alert("Username must be lowercase letters only and cannot contain spaces");
      return;
    }

    // Save all to localStorage
    localStorage.setItem("username", username);
    localStorage.setItem("ign", ign);
    localStorage.setItem("ffuid", ffuid);
    localStorage.setItem("fflevel", fflevel);
    localStorage.setItem("xp", xp);

    // Update top-right
    loginBtnTop.textContent = username;
    loginBtnTop.style.pointerEvents = "none";

    alert("Profile updated successfully!");

    // XP shine effect
    if(xp >= 7000){
      usernameInput.classList.add("shine-effect");
    } else {
      usernameInput.classList.remove("shine-effect");
    }
  });

  // -----------------------------
  // LOGOUT
  // -----------------------------
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

    // Reset top-right button
    loginBtnTop.textContent = "Login";
    loginBtnTop.style.pointerEvents = "auto";

    // Hide username popup
    usernamePopup.style.display = "none";

    alert("You have been logged out");
  });

  // -----------------------------
  // PRE-FILL PROFILE ON PAGE LOAD
  // -----------------------------
  const role = localStorage.getItem("userRole");
  if(role === "player"){
    const username = localStorage.getItem("username");
    if(username){
      usernameInput.value = username;
      ignInput.value = localStorage.getItem("ign") || "";
      ffUidInput.value = localStorage.getItem("ffuid") || "";
      ffLevelInput.value = localStorage.getItem("fflevel") || "";
      xpDisplay.textContent = localStorage.getItem("xp") || "0";

      profileSection.classList.remove("profileLocked");

      // XP shine effect
      if(parseInt(localStorage.getItem("xp") || 0) >= 7000){
        usernameInput.classList.add("shine-effect");
      }
    }
  } else if(role === "admin" || role === "owner"){
    // Admin/Owner: profile locked, show displayName
    const displayName = localStorage.getItem("displayName") || "Admin";
    loginBtnTop.textContent = displayName;
    loginBtnTop.style.pointerEvents = "none";
    profileSection.classList.add("profileLocked");
  }

});
                  
