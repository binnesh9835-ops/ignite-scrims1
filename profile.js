import { auth } from "./firebase.js";

import {
getFirestore,
doc,
setDoc,
getDoc,
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = getFirestore();



/* SAVE USERNAME FIRST TIME */

window.saveUsername = async function(){

const user = auth.currentUser;

if(!user){

alert("Login required");

return;

}

let username =
document.getElementById("newUsername").value.trim();



/* VALIDATION */

if(username.includes(" ") || username !== username.toLowerCase()){

alert("Username must be small letters without spaces");

return;

}



/* UNIQUE USERNAME CHECK */

const q = query(
collection(db,"users"),
where("username","==",username)
);

const querySnapshot = await getDocs(q);

if(!querySnapshot.empty){

alert("Username already taken");

return;

}



/* SAVE USER */

await setDoc(doc(db,"users",user.uid),{

username:username,
ign:"",
ffuid:"",
fflevel:"",
xp:0

});



document.getElementById("usernamePopup").style.display="none";

alert("Username created successfully");



location.reload();

};



/* SAVE PROFILE */

window.saveProfile = async function(){

const user = auth.currentUser;

if(!user){

alert("Login required");

return;

}

let username =
document.getElementById("username").value.trim();

let ign =
document.getElementById("ign").value.trim();

let ffuid =
document.getElementById("ffuid").value.trim();

let fflevel =
document.getElementById("fflevel").value.trim();



const ref = doc(db,"users",user.uid);

const snap = await getDoc(ref);



let oldData = snap.data();



await setDoc(ref,{

username:username,
ign:ign,
ffuid:ffuid,
fflevel:fflevel,
xp:oldData.xp

});



alert("Profile updated successfully");

};



/* LOAD PROFILE DATA */

auth.onAuthStateChanged(async (user)=>{

if(!user) return;



const ref = doc(db,"users",user.uid);

const snap = await getDoc(ref);



if(!snap.exists()) return;



let data = snap.data();



document.getElementById("username").value = data.username || "";

document.getElementById("ign").value = data.ign || "";

document.getElementById("ffuid").value = data.ffuid || "";

document.getElementById("fflevel").value = data.fflevel || "";

document.getElementById("xpLevel").innerText = data.xp || 0;

});
