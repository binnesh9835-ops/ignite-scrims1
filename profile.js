import { auth, db } from "./firebase.js";

import {
doc,
getDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



const profileModal = document.getElementById("profileModal");
const profileBtn = document.getElementById("profileBtn");
const closeProfile = document.getElementById("closeProfile");



// OPEN PROFILE

profileBtn.addEventListener("click", () => {

profileModal.style.display = "flex";

});



// CLOSE PROFILE

closeProfile.addEventListener("click", () => {

profileModal.style.display = "none";

});



// LOAD PROFILE DATA

onAuthStateChanged(auth, async (user) => {

if(user){

const userRef = doc(db,"users",user.uid);

const docSnap = await getDoc(userRef);

if(docSnap.exists()){

const data = docSnap.data();

document.querySelector(".profile-content").innerHTML = 

<span class="close-btn" id="closeProfile">X</span>

<h2>${data.username}</h2>

<p>XP: ${data.xp}</p>
<p>Matches Played: ${data.matches_played}</p>

<hr>

<h3>Game Profile</h3>

<input id="ign" placeholder="IGN" value="${data.ign || ""}">

<input id="gameuid" placeholder="Game UID" value="${data.game_uid || ""}">

<input id="level" placeholder="Level" value="${data.ign_level || ""}">

<textarea id="bio" maxlength="60" placeholder="Bio (max 60 chars)">${data.bio || ""}</textarea>

<button id="saveProfile">Save</button>

;



document.getElementById("saveProfile").onclick = async () => {

await updateDoc(userRef,{

ign: document.getElementById("ign").value,
game_uid: document.getElementById("gameuid").value,
ign_level: document.getElementById("level").value,
bio: document.getElementById("bio").value

});

alert("Profile Updated");

};

}

}

});
