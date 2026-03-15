import { auth, db } from "./firebase.js";

import {
doc,
getDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



const profileSection = document.getElementById("profile");



profileSection.innerHTML = 

<h2>Player Profile</h2>

<input id="profileUsername" placeholder="Username" disabled>

<br><br>

<input id="profileIGN" placeholder="In Game Name">

<br><br>

<input id="profileUID" placeholder="Free Fire UID">

<br><br>

<input id="profileLevel" placeholder="Free Fire Level">

<br><br>

<button id="saveProfileBtn">
Save Profile
</button>

<br><br>

<button onclick="logoutUser()">
Logout
</button>

;



const usernameInput = document.getElementById("profileUsername");
const ignInput = document.getElementById("profileIGN");
const uidInput = document.getElementById("profileUID");
const levelInput = document.getElementById("profileLevel");
const saveBtn = document.getElementById("saveProfileBtn");



onAuthStateChanged(auth, async (user)=>{

if(!user) return;

const uid = user.uid;

const userRef = doc(db,"users",uid);

const snap = await getDoc(userRef);



if(snap.exists()){

const data = snap.data();



usernameInput.value = data.username || "";

ignInput.value = data.ign || "";

uidInput.value = data.ffuid || "";

levelInput.value = data.level || "";

}

});



saveBtn.onclick = async ()=>{

const uid = auth.currentUser.uid;

const userRef = doc(db,"users",uid);



await updateDoc(userRef,{

ign: ignInput.value.trim(),

ffuid: uidInput.value.trim(),

level: levelInput.value.trim()

});



alert("Profile Saved");

};
