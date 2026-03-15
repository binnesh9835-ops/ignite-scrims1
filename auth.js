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


// GOOGLE LOGIN
document.addEventListener("click", async (e)=>{

if(e.target && e.target.id==="googleLogin"){

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

}



// LOGOUT
if(e.target && e.target.id==="logoutBtn"){

await signOut(auth);

location.reload();

}

});



// AUTH STATE CHANGE
onAuthStateChanged(auth, async (user)=>{

const loginBtn = document.getElementById("loginBtn");


if(!user){

loginBtn.innerText="Login";
return;

}


// GET USER DATA
const userRef = doc(db,"users",user.uid);

const snap = await getDoc(userRef);

let data = snap.data();


// CHANGE LOGIN BUTTON
loginBtn.innerText=data.username;


// ADD LOGOUT BUTTON
loginBtn.onclick=()=>{

if(document.getElementById("logoutBtn")) return;

const btn=document.createElement("button");

btn.id="logoutBtn";
btn.innerText="Logout";

btn.style.position="absolute";
btn.style.top="60px";
btn.style.right="20px";

document.body.appendChild(btn);

}


// ADMIN DETECT
if(data.role==="admin" || data.role==="owner"){

console.log("Admin logged in");

}

});




// SAVE USERNAME
window.saveUsername = async function(){

const username=document.getElementById("newUsername").value.trim();

const user=auth.currentUser;


if(!username){

alert("Enter username");
return;

}


// ADMIN / OWNER AUTO SET
let role="user";

if(user.email==="vishalpandey25288@gmail.com") role="owner";

if(user.email==="vmtournament20@gmail.com") role="admin";


await setDoc(doc(db,"users",user.uid),{

username:username,
wallet:0,
ign:"",
ffuid:"",
level:0,
role:role

});


location.reload();

}
