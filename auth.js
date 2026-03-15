// auth.js
window.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("googleLogin");
  const loginPopup = document.getElementById("loginPopup");
  const usernamePopup = document.getElementById("usernamePopup");
  const confirmUsernameBtn = document.getElementById("confirmUsernameBtn");

  // Simulated Google Login
  loginBtn.onclick = () => {
    // Simulate Google login success
    const fakeUser = {
      email: "player@example.com",
      role: "player", // can be "player", "admin", "owner"
      displayName: "Player123"
    };
    localStorage.setItem("userEmail", fakeUser.email);
    localStorage.setItem("userRole", fakeUser.role);
    localStorage.setItem("displayName", fakeUser.displayName);

    loginPopup.style.display = "none";

    // If player has no username, show username popup
    if (!localStorage.getItem("username") && fakeUser.role === "player") {
      usernamePopup.style.display = "flex";
    } else {
      updateTopRightDisplay();
    }
  };

  // Confirm username creation
  confirmUsernameBtn.onclick = () => {
    const newUsernameInput = document.getElementById("newUsername");
    let username = newUsernameInput.value.trim();

    if (username === ""  username.includes(" ")  /[^a-z0-9]/.test(username) || username.length > 12) {
      alert("Username must be lowercase letters, numbers allowed, max 12 chars, no spaces or special chars");
      return;
    }

    localStorage.setItem("username", username);
    usernamePopup.style.display = "none";
    updateTopRightDisplay();
  };

  function updateTopRightDisplay() {
    const loginDisplay = document.getElementById("loginBtn");
    const role = localStorage.getItem("userRole");
    if (role === "player") {
      loginDisplay.textContent = localStorage.getItem("username");
    } else {
      loginDisplay.textContent = localStorage.getItem("displayName");
    }
    loginDisplay.style.pointerEvents = "none";
  }

  // Initialize top-right display on reload
  updateTopRightDisplay();
});
