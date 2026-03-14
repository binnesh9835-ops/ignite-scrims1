import { auth, provider } from "./firebase.js";

import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

window.addEventListener("DOMContentLoaded", () => {

const googleBtn = document.getElementById("googleLogin");

googleBtn.addEventListener("click", async () => {

try {

const result = await signInWithPopup(auth, provider);

const user = result.user;

// 👇 YE IMPORTANT LINE HAI
console.log("USER UID:", user.uid);

alert("Welcome " + user.displayName);

document.getElementById("loginPopup").style.display = "none";

}

catch(error){

alert(error.message);

}

});

});
