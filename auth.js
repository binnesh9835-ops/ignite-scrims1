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



// OPEN LOGIN POPUP

profileBtn.onclick = () => {

document.getElementById("loginPopup").style.display="flex";

};



// CLOSE LOGIN

document.getElementById("closeLogin").onclick=()=>{

document.getElementById("loginPopup").style.display="none";

};



// GOOGLE LOGIN

document.getElementById("googleLoginBtn").onclick=async()=>{

const result = await signInWithPopup(auth, provider);

const user = result.user;

await saveUser(user);

document.getElementById("loginPopup").style.display="none";

};



// SAVE USER

async function saveUser(user){

const userRef = doc(db,"users",user.uid);

const snap = await getDoc(userRef);

if(!snap.exists()){

await setDoc(userRef,{

username:user.displayName,
email:user.email,
xp:0,
matches_played:0,
role:"user"

});

}

}



// LOGIN STATE

onAuthStateChanged(auth,(user)=>{

if(user){

profileBtn.innerText=user.displayName;

}

});
