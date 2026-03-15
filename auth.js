import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCgyT_wRam-8FWkq5VePffFtymUMbRnXCQ",
  authDomain: "ignite-scrims.firebaseapp.com",
  projectId: "ignite-scrims",
  storageBucket: "ignite-scrims.firebasestorage.app",
  messagingSenderId: "497561769270",
  appId: "1:497561769270:web:ef4f215a253e984f2dcf97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("googleLogin");
const loginPopup = document.getElementById("loginPopup");
const usernamePopup = document.getElementById("usernamePopup");

loginBtn.onclick = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save basic user info in localStorage
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("displayName", user.displayName);

    // Determine role (for testing: first email is owner, others can be admin/player)
    let role = "player"; // default
    const ownerEmail = "vishalpandey25288@gmail.com"; // change to real owner email
    const adminEmails = ["vmtournament20@gmail.com"]; // real admin emails

    if (user.email === ownerEmail) role = "owner";
    else if (adminEmails.includes(user.email)) role = "admin";

    localStorage.setItem("userRole", role);

    // Update top-right login button
    const topLoginBtn = document.getElementById("loginBtn");
    topLoginBtn.textContent = role === "player" ? "Player" : user.displayName;
    topLoginBtn.style.pointerEvents = "none";

    loginPopup.style.display = "none";

    // If player and username not set, show username popup
    if (role === "player" && !localStorage.getItem("username")) {
      usernamePopup.style.display = "flex";
    }

    alert(Welcome ${user.displayName}! Role: ${role});
  } catch (error) {
    console.error(error);
    alert("Login failed. Please try again.");
  }
};
