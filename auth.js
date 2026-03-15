// auth.js
import { auth, provider } from "./firebase.js";
import { signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const loginBtn = document.getElementById("googleLogin");
const loginButtonTop = document.getElementById("loginBtn");
const usernamePopup = document.getElementById("usernamePopup");

// LOGIN WITH GOOGLE
loginBtn.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save email and displayName
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("displayName", user.displayName);

    // Determine role: simple logic, if email includes "admin" => admin, else player
    let role = "player";
    if(user.email.includes("admin")) role = "admin";
    if(user.email.includes("owner")) role = "owner";
    localStorage.setItem("userRole", role);

    // Update top-right button
    if(role === "player"){
      // Show username popup if not set
      const username = localStorage.getItem("username");
      if(!username){
        usernamePopup.style.display = "flex";
      } else {
        loginButtonTop.textContent = username;
        loginButtonTop.style.pointerEvents = "none";
      }
    } else {
      // Admin/Owner
      loginButtonTop.textContent = user.displayName;
      loginButtonTop.style.pointerEvents = "none";
    }

    // Close login popup
    document.getElementById("loginPopup").style.display = "none";

  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed. Try again!");
  }
});

// Maintain login state on reload
onAuthStateChanged(auth, (user) => {
  if(user){
    const role = localStorage.getItem("userRole");
    if(role === "player"){
      const username = localStorage.getItem("username");
      if(username){
        loginButtonTop.textContent = username;
        loginButtonTop.style.pointerEvents = "none";
      } else {
        usernamePopup.style.display = "flex";
      }
    } else {
      loginButtonTop.textContent = user.displayName;
      loginButtonTop.style.pointerEvents = "none";
    }
  } else {
    loginButtonTop.textContent = "Login";
    loginButtonTop.style.pointerEvents = "auto";
  }
});
