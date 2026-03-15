import { auth, provider, db } from "./firebase.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Emails
let admins = ["vmtournament20@gmail.com"];
let owner = "vishalpandey25288@gmail.com";

// Login button
window.addEventListener("DOMContentLoaded", () => {
  const googleBtn = document.getElementById("googleLogin");

  googleBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email;

      let role = "player";

      if(email === owner){
        role = "owner";
      }
      else if(admins.includes(email)){
        role = "admin";
      }

      alert("Welcome " + user.displayName + " (" + role + ")");

      document.getElementById("loginPopup").style.display="none";

      /* OWNER PANEL SHOW */
      if(role === "owner"){
        showOwnerPanel();
      }
      /* ADMIN PANEL SHOW */
      else if(role === "admin"){
        showAdminPanel();
      }

      /* PLAYER → check username */
      else if(role === "player"){
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if(!snap.exists() || !snap.data().username){
          // Show username popup
          document.getElementById("usernamePopup").style.display = "flex";
        }
      }

    } catch(error){
      alert(error.message);
    }
  });
});

/* OWNER FUNCTIONS */
function showOwnerPanel(){
  console.log("Owner Panel Enabled");
}

/* ADMIN FUNCTIONS */
function showAdminPanel(){
  console.log("Admin Panel Enabled");
}

/* SAVE USERNAME */
document.getElementById("saveUsernameBtn").onclick = async () => {
  const usernameInput = document.getElementById("usernameInput");
  const username = usernameInput.value.toLowerCase().trim();

  if(username === "" || username.includes(" ")){
    alert("Username cannot be empty or contain spaces");
    return;
  }

  const user = auth.currentUser;
  if(!user) return alert("Please login first");

  // Check if username already exists
  const usernameRef = doc(db, "usernames", username);
  const snap = await getDoc(usernameRef);
  if(snap.exists()){
    alert("This username is already taken. Choose another one.");
    return;
  }

  await setDoc(doc(db,"usernames",username), { uid:user.uid });
  await setDoc(doc(db,"users",user.uid), { username, email:user.email, ign:"", ff_uid:"", ff_level:"", xp:0 });

  alert("Username saved successfully");
  document.getElementById("usernamePopup").style.display="none";

  // Show username at top right
  const loginBtn = document.getElementById("googleLogin");
  loginBtn.style.display = "none";
  const usernameDisplay = document.getElementById("usernameDisplay");
  usernameDisplay.textContent = username;
  usernameDisplay.style.display = "block";
};
