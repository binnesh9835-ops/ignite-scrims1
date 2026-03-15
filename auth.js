// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Firebase config (replace with your own)
const firebaseConfig = {
    apiKey: "AIzaSyCgyT_wRam-8FWkq5VePffFtymUMbRnXCQ",
  authDomain: "ignite-scrims.firebaseapp.com",
  projectId: "ignite-scrims",
  storageBucket: "ignite-scrims.firebasestorage.app",
  messagingSenderId: "497561769270",
  appId: "1:497561769270:web:ef4f215a253e984f2dcf97"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("googleLogin");
const loginButtonTop = document.getElementById("loginBtn");
const loginPopup = document.getElementById("loginPopup");
const usernamePopup = document.getElementById("usernamePopup");

// Click Google login
loginBtn.addEventListener("click", async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const email = user.email;
        const displayName = user.displayName;

        // Check user role based on email (example)
        let userRole = "player"; // default
        const adminEmails = ["admin@example.com"];
        const ownerEmails = ["owner@example.com"];

        if (adminEmails.includes(email)) userRole = "admin";
        if (ownerEmails.includes(email)) userRole = "owner";

        // Save in localStorage
        localStorage.setItem("userEmail", email);
        localStorage.setItem("displayName", displayName);
        localStorage.setItem("userRole", userRole);

        loginPopup.style.display = "none";

        if (userRole === "player") {
            // Check if username already exists
            let username = localStorage.getItem("username");
            if (!username) {
                usernamePopup.style.display = "flex"; // show create username popup
            } else {
                // Already have username, update top-right button
                loginButtonTop.textContent = username;
                loginButtonTop.style.pointerEvents = "none";
            }
        } else {
            // Admin/Owner: only displayName, profile locked
            loginButtonTop.textContent = displayName;
            loginButtonTop.style.pointerEvents = "none";
        }

    } catch (error) {
        console.error("Google login error:", error);
        alert("Login failed. Try again.");
    }
});

// Logout function
export function logoutUser() {
    if (!confirm("Are you sure you want to logout?")) return;

    signOut(auth).then(() => {
        // Clear localStorage
        localStorage.removeItem("username");
        localStorage.removeItem("ign");
        localStorage.removeItem("ffuid");
        localStorage.removeItem("fflevel");
        localStorage.removeItem("xp");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("displayName");

        // Reset top-right button
        loginButtonTop.textContent = "Login";
        loginButtonTop.style.pointerEvents = "auto";

        // Hide popups if open
        loginPopup.style.display = "none";
        usernamePopup.style.display = "none";

        // Reset profile section visually
        const profileSection = document.getElementById("profile");
        profileSection.classList.add("profileLocked");
        document.getElementById("username").value = "";
        document.getElementById("ign").value = "";
        document.getElementById("ffuid").value = "";
        document.getElementById("fflevel").value = "";
        document.getElementById("xpLevel").textContent = "0";

        alert("You have been logged out");
    }).catch((err) => {
        console.error("Logout error:", err);
        alert("Logout failed. Try again.");
    });
}

// Export for profile.js usage
export { auth, provider };
