import { auth, provider } from "./firebase.js";

import {
signInWithPopup,
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
getFirestore,
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = getFirestore();


/* OWNER & ADMIN EMAIL */

let owner = "vishalpandey25288@gmail.com";

let admins = [
"vmtournament20@gmail.com"
];


/* LOGIN BUTTON */

const loginBtn = document.getElementById("loginBtn");


/* LOGIN CLICK */

loginBtn.onclick = () => {

document.getElementById("loginPopup").style.display="flex";

};


/* GOOGLE LOGIN */

document.getElementById("googleLogin").onclick = async ()=>{

try{

const result = await signInWithPopup(auth, provider);

const user = result.user;

checkUserProfile(user);

document.getElementById("loginPopup").style.display="none";

}

catch(err){

alert(err.message);

}

};


/* AUTO LOGIN CHECK */

onAuthStateChanged(auth, async (user)=>{

if(user){

checkUserProfile(user);

unlockProfile();

}

else{

lockProfile();

}

});


/* CHECK PROFILE */

async function checkUserProfile(user){

const ref = doc(db,"users",user.uid);

const snap = await getDoc(ref);

let role = "player";

if(user.email === owner){

role="owner";

}

else if(admins.includes(user.email)){

role="admin";

}


/* USERNAME NOT CREATED */

if(!snap.exists()){

document.getElementById("usernamePopup").style.display="flex";

return;

}


/* USERNAME EXISTS */

let data = snap.data();

showLoggedUser(data.username,role);

}


/* SHOW USERNAME */

function showLoggedUser(username,role){

let badge="";

if(role==="admin"){

badge=" ✔";

}

if(role==="owner"){

badge=" ⭐";

}

loginBtn.innerText = username + badge;

loginBtn.onclick = ()=>{

document.querySelector('[data-tab="profile"]').click();

};

}


/* PROFILE LOCK */

function lockProfile(){

document
.getElementById("profile")
.classList.add("profileLocked");

}


/* PROFILE UNLOCK */

function unlockProfile(){

document
.getElementById("profile")
.classList.remove("profileLocked");

}


/* LOGOUT */

window.logoutUser = async function(){

let confirmLogout = confirm("Are you sure you want to logout?");

if(!confirmLogout) return;

await signOut(auth);

location.reload();

};
