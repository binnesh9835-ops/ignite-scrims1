import { auth, db } from "./firebase.js";

import {
GoogleAuthProvider,
signInWithPopup,
signOut,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
doc,
getDoc,
setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const provider = new GoogleAuthProvider();



// GOOGLE LOGIN FUNCTION
window.googleLogin = async function(){

try{

const result = await signInWithPopup(auth, provider);

const user = result.user;

const userRef = doc(db,"users",user.uid);

const snap = await getDoc(userRef);


// NEW USER
if(!snap.exists()){

document.getElementById("usernamePopup").style.display="flex";

}else{

document.getElementById("loginPopup").style.display="none";

}

}catch(err){

alert(err.message);

}

};




// SAVE USERNAME
window.saveUsername = async function(){

const username = document.getElementById("newUsername").value.trim();

const user = auth.currentUser;

if(!username){

alert("Enter Username");
return;

}


// ROLE DETECT
let role = "user";

if(user.email==="vishalpandey25288@gmail.com"){

role="owner";

}

if(user.email==="vmtournament20@gmail.com"){

role="admin";

}


await setDoc(doc(db,"users",user.uid),{

username:username,
wallet:0,
ign:"",
ffuid:"",
level:0,
role:role

});


document.getElementById("usernamePopup").style.display="none";

location.reload();

};




// AUTH STATE
onAuthStateChanged(auth, async (user)=>{

const loginBtn = document.getElementById("loginBtn");

if(!user){

if(loginBtn){

loginBtn.innerText="Login";

}

return;

}


const userRef = doc(db,"users",user.uid);

const snap = await getDoc(userRef);

const data = snap.data();


// LOGIN BUTTON CHANGE
if(loginBtn){

loginBtn.innerText=data.username;

}


// ADD LOGOUT BUTTON
loginBtn.onclick = function(){

const existing=document.getElementById("logoutBtn");

if(existing) return;

const btn=document.createElement("button");

btn.id="logoutBtn";

btn.innerText="Logout";

btn.style.position="absolute";
btn.style.top="70px";
btn.style.right="20px";

btn.onclick=logoutUser;

document.body.appendChild(btn);

};


// ADMIN / OWNER DETECT
if(data.role==="admin"){

console.log("Admin logged in");

}

if(data.role==="owner"){

console.log("Owner logged in");

}

});




// LOGOUT FUNCTION
async function logoutUser(){

await signOut(auth);

location.reload();

}
