import { auth, provider } from "./firebase.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let admins = [
"vmtournament20@gmail.com"
];

let owner = "vishalpandey25288@gmail.com";

window.addEventListener("DOMContentLoaded", () => {

const googleBtn = document.getElementById("googleLogin");

if(!googleBtn) return;

googleBtn.addEventListener("click", async () => {

try{

const result = await signInWithPopup(auth, provider);

const user = result.user;

const email = user.email;

let role = "player";


/* ROLE CHECK */

if(email === owner){

role = "owner";

}

else if(admins.includes(email)){

role = "admin";

}


/* LOGIN SUCCESS */

alert("Welcome " + user.displayName + " (" + role + ")");

document.getElementById("loginPopup").style.display="none";


/* PANEL CONTROL */

if(role === "owner"){

showOwnerPanel();

}

else if(role === "admin"){

showAdminPanel();

}

}
catch(error){

alert(error.message);

}

});

});


/* OWNER PANEL */

function showOwnerPanel(){

const panel = document.getElementById("adminPanel");

if(panel){

panel.style.display = "block";

}

console.log("Owner Panel Enabled");

}


/* ADMIN PANEL */

function showAdminPanel(){

const panel = document.getElementById("adminPanel");

if(panel){

panel.style.display = "block";

}

console.log("Admin Panel Enabled");

}
