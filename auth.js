// auth.js
import { auth, provider } from "./firebase.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let admins = [
  "vmtournament20@gmail.com"
];

let owner = "vishalpandey25288@gmail.com";

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

      // Save basic info in localStorage
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", role);
      localStorage.setItem("displayName", user.displayName || "Player");

      // Hide login popup
      document.getElementById("loginPopup").style.display = "none";

      // Owner/Admin panel display
      if (role === "owner") {
        showOwnerPanel();
        showUsernameTop(); // just show displayName
      } else if (role === "admin") {
        showAdminPanel();
        showUsernameTop(); // just show displayName
      } else {
        // Player: show username popup if not set
        const username = localStorage.getItem("username");
        if (!username) {
          document.getElementById("usernamePopup").style.display = "flex";
        } else {
          showUsernameTop();
        }
      }

    } catch (error) {
      alert(error.message);
    }
  });

});

/* OWNER FUNCTIONS */
function showOwnerPanel() {
  console.log("Owner Panel Enabled");
}

/* ADMIN FUNCTIONS */
function showAdminPanel() {
  console.log("Admin Panel Enabled");
}

/* SHOW USERNAME TOP-RIGHT */
function showUsernameTop() {
  const usernameDisplay = document.getElementById("loginBtn");
  const role = localStorage.getItem("userRole");
  if (role === "player") {
    usernameDisplay.textContent = localStorage.getItem("username") || localStorage.getItem("displayName");
  } else {
    usernameDisplay.textContent = localStorage.getItem("displayName");
  }
  usernameDisplay.style.pointerEvents = "none"; // disable click
}
