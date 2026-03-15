import { auth } from "./firebase.js";

window.addEventListener("DOMContentLoaded", () => {

  const profileSection = document.getElementById("profile");
  const usernameInput = document.getElementById("username");
  const ignInput = document.getElementById("ign");
  const uidInput = document.getElementById("ffuid");
  const levelInput = document.getElementById("fflevel");
  const xpSpan = document.getElementById("xpLevel");

  const usernamePopup = document.getElementById("usernamePopup");
  const newUsernameInput = document.getElementById("newUsername");

  const role = localStorage.getItem("role");
  const displayName = localStorage.getItem("displayName");

  // Show profile section only if logged in
  if(role){
    profileSection.classList.remove("profileLocked");

    // If user is normal player
    if(role === "player"){

      // Show username popup if not set
      const storedUsername = localStorage.getItem("username");
      if(!storedUsername){
        usernamePopup.style.display = "flex";
      } else {
        usernameInput.value = storedUsername;
        ignInput.value = localStorage.getItem("ign") || "";
        uidInput.value = localStorage.getItem("ffuid") || "";
        levelInput.value = localStorage.getItem("fflevel") || "";
        xpSpan.textContent = localStorage.getItem("xp") || 0;
      }

    } 
    // If admin or owner, hide username/ign/uid fields
    else if(role === "admin" || role === "owner"){
      usernameInput.style.display = "none";
      ignInput.style.display = "none";
      uidInput.style.display = "none";
      levelInput.style.display = "none";
      xpSpan.textContent = localStorage.getItem("xp") || 0;

      // Change heading
      document.querySelector("#profile h2").textContent = 
        role === "owner" ? Welcome ${displayName} (Owner) : Welcome ${displayName} (Admin);
    }
  }


});

// SAVE USERNAME FROM POPUP
window.saveUsername = function(){
  const username = document.getElementById("newUsername").value.trim();

  if(username === "" || !/^[a-z]+$/.test(username)){
    alert("Enter valid username (small letters only, no spaces).");
    return;
  }

  if(localStorage.getItem("allUsernames")){
    const allUsernames = JSON.parse(localStorage.getItem("allUsernames"));
    if(allUsernames.includes(username)){
      alert("Username already taken, choose another.");
      return;
    } else {
      allUsernames.push(username);
      localStorage.setItem("allUsernames", JSON.stringify(allUsernames));
    }
  } else {
    localStorage.setItem("allUsernames", JSON.stringify([username]));
  }

  localStorage.setItem("username", username);
  document.getElementById("username").value = username;
  document.getElementById("usernamePopup").style.display = "none";

  alert("Username set successfully!");
}


// SAVE PROFILE CHANGES
window.saveProfile = function(){
  const username = document.getElementById("username").value.trim();
  const ign = document.getElementById("ign").value.trim();
  const ffuid = document.getElementById("ffuid").value.trim();
  const fflevel = document.getElementById("fflevel").value.trim();

  if(!username  !ign  !ffuid){
    alert("Username, IGN and UID are required!");
    return;
  }

  localStorage.setItem("username", username);
  localStorage.setItem("ign", ign);
  localStorage.setItem("ffuid", ffuid);
  localStorage.setItem("fflevel", fflevel);
  localStorage.setItem("xp", localStorage.getItem("xp") || 0);

  alert("Profile changes saved successfully!");
}


// LOGOUT FUNCTION
window.logoutUser = function(){
  if(confirm("Are you sure you want to logout?")){
    localStorage.clear();
    location.reload();
  }
}
