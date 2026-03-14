import { auth, provider } from "./firebase.js";

import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let admins = [
"vmtournament20@gmail.com"
];

let owner = "vishalpandey25288@gmail.com";

window.addEventListener("DOMContentLoaded", () => {

const googleBtn = document.getElementById("googleLogin");

googleBtn.addEventListener("click", async () => {

try{

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

}
catch(error){

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
