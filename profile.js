import { auth, db } from "./firebase.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

window.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.getElementById("profileBtn");
  const profilePopup = document.getElementById("profilePopup");

  profileBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if(!user){
      alert("Please login first");
      return;
    }

    // Show profile popup
    profilePopup.style.display = "flex";

    // Load profile data
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if(snap.exists()){
      const data = snap.data();
      document.getElementById("profileUsername").value = data.username || "";
      document.getElementById("profileIGN").value = data.ign || "";
      document.getElementById("profileUID").value = data.ff_uid || "";
      document.getElementById("profileLevel").value = data.ff_level || "";
      document.getElementById("profileXP").textContent = data.xp || 0;

      // Shine effect if XP >= 7000
      if(data.xp >= 7000){
        document.getElementById("profileUsername").classList.add("shine-effect");
      } else {
        document.getElementById("profileUsername").classList.remove("shine-effect");
      }
    }
  });

  // Save profile changes
  document.getElementById("saveProfileBtn").addEventListener("click", async () => {
    const user = auth.currentUser;
    if(!user) return alert("Please login first");

    const username = document.getElementById("profileUsername").value.toLowerCase().trim();
    const ign = document.getElementById("profileIGN").value.trim();
    const ff_uid = document.getElementById("profileUID").value.trim();
    const ff_level = document.getElementById("profileLevel").value.trim();

    if(username === "" || username.includes(" ")){
      alert("Username cannot be empty or contain spaces");
      return;
    }

    // Update Firestore
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { username, ign, ff_uid, ff_level });

    alert("Profile updated successfully!");

    // Update top-right username display
    const usernameDisplay = document.getElementById("usernameDisplay");
    usernameDisplay.textContent = username;
    usernameDisplay.style.display = "block";

    // Close popup
    document.getElementById("profilePopup").style.display = "none";
  });

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if(!confirmLogout) return;

    await signOut(auth);
    alert("You have been logged out");

    // Reset top-right username display
    const usernameDisplay = document.getElementById("usernameDisplay");
    usernameDisplay.style.display = "none";

    // Show login button again
    document.getElementById("googleLogin").style.display = "block";

    // Clear profile inputs
    document.getElementById("profileUsername").value = "";
    document.getElementById("profileIGN").value = "";
    document.getElementById("profileUID").value = "";
    document.getElementById("profileLevel").value = "";
    document.getElementById("profileXP").textContent = "0";

    // Hide profile popup
    document.getElementById("profilePopup").style.display = "none";
  });

});
