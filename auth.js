// auth.js
import { auth, provider } from "./firebase.js";
import { signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

window.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const loginPopup = document.getElementById("loginPopup");
  const usernamePopup = document.getElementById("usernamePopup");
  const confirmUsernameBtn = document.getElementById("confirmUsernameBtn");
  const newUsernameInput = document.getElementById("newUsername");

  // Show login popup
  loginBtn.addEventListener("click", () => {
    loginPopup.style.display = "flex";
  });

  // Google Login
  const googleLoginBtn = document.getElementById("googleLogin");
  googleLoginBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save email & displayName in localStorage
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("displayName", user.displayName);

      // Determine role (example: admin email list)
      const adminEmails = ["admin@gmail.com"];
      const ownerEmails = ["owner@gmail.com"];
      let role = "player";
      if (adminEmails.includes(user.email)) role = "admin";
      if (ownerEmails.includes(user.email)) role = "owner";
      localStorage.setItem("userRole", role);

      // Update top-right display
      if (role === "player") {
        // Check if username already set
        const username = localStorage.getItem("username");
        if (!username) {
          // Show username popup
          usernamePopup.style.display = "flex";
        } else {
          loginBtn.textContent = username;
          loginBtn.style.pointerEvents = "none";
        }
      } else {
        // Admin/Owner: no username popup
        loginBtn.textContent = user.displayName;
        loginBtn.style.pointerEvents = "none";
      }

      // Close login popup
      loginPopup.style.display = "none";
    } catch (error) {
      console.error("Google login error:", error);
      alert("Login failed, try again.");
    }
  });

  // Confirm username popup
  confirmUsernameBtn.addEventListener("click", () => {
    const username = newUsernameInput.value.trim();
    if (
      username === "" ||
      username.includes(" ") ||
      /[^a-z0-9]/.test(username) ||
      username.length > 12
    ) {
      alert(
        "Username must be lowercase letters & numbers only, no spaces, max 12 chars"
      );
      return;
    }

    // Save in localStorage
    localStorage.setItem("username", username);

    // Update top-right display
    loginBtn.textContent = username;
    loginBtn.style.pointerEvents = "none";

    // Hide popup
    usernamePopup.style.display = "none";

    // Unlock profile section
    const profileSection = document.getElementById("profile");
    profileSection.classList.remove("profileLocked");

    // Pre-fill profile username input
    const usernameInput = document.getElementById("username");
    usernameInput.value = username;
  });

  // Logout function
  window.logoutUser = () => {
    if (!confirm("Are you sure you want to logout?")) return;

    // Clear localStorage
    localStorage.removeItem("username");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("displayName");
    localStorage.removeItem("ign");
    localStorage.removeItem("ffuid");
    localStorage.removeItem("fflevel");
    localStorage.removeItem("xp");

    // Reset top-right display
    loginBtn.textContent = "Login";
    loginBtn.style.pointerEvents = "auto";

    // Lock profile section
    const profileSection = document.getElementById("profile");
    profileSection.classList.add("profileLocked");

    // Hide username popup if open
    usernamePopup.style.display = "none";

    // Sign out from Firebase
    signOut(auth);
  };

                        // Pre-fill top-right display if page reload
  const role = localStorage.getItem("userRole");
  const storedUsername = localStorage.getItem("username");
  if (role) {
    if (role === "player") {
      if (storedUsername) {
        loginBtn.textContent = storedUsername;
        loginBtn.style.pointerEvents = "none";

        // Unlock profile section
        const profileSection = document.getElementById("profile");
        profileSection.classList.remove("profileLocked");

        // Fill username input
        const usernameInput = document.getElementById("username");
        usernameInput.value = storedUsername;
      }
    } else {
      // Admin/Owner
      const displayName = localStorage.getItem("displayName");
      loginBtn.textContent = displayName;
      loginBtn.style.pointerEvents = "none";
      const profileSection = document.getElementById("profile");
      profileSection.classList.add("profileLocked");
    }
  }
});
