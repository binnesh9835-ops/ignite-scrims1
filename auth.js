import { auth, db } from "./firebase.js";

import { 
GoogleAuthProvider,
signInWithPopup,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
doc,
setDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const provider = new GoogleAuthProvider();

const profileBtn = document.getElementById("profileBtn");



// LOGIN BUTTON CLICK

profileBtn.onclick = async () => {

if(profileBtn.innerText === "Login"){

const result = await signInWithPopup(auth, provider);

const user = result.user;

await saveUser(user);

}

};



// SAVE USER TO DATABASE

async function saveUser(user){

const userRef = doc(db, "users", user.uid);

const docSnap = await getDoc(userRef);

if(!docSnap.exists()){

await setDoc(userRef,{

username: user.displayName,
email: user.email,
xp: 0,
matches_played: 0,
wins: 0,
role: "user"

});

}

}



// CHECK LOGIN STATE

onAuthStateChanged(auth, async (user) => {

if(user){

profileBtn.innerText = user.displayName;

checkRole(user.uid);

}

});



// ROLE CHECK

async function checkRole(uid){

const userRef = doc(db, "users", uid);

const docSnap = await getDoc(userRef);

if(docSnap.exists()){

const data = docSnap.data();

if(data.role === "admin" || data.role === "owner"){

document.getElementById("adminPanel").style.display = "block";

}

}

}
