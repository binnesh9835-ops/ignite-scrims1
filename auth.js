import { auth, db } from "./firebase.js";

import {
GoogleAuthProvider,
signInWithPopup,
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
doc,
getDoc,
setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("loginBtn");
const loginPopup = document.getElementById("loginPopup");
const googleLogin = document.getElementById("googleLogin");



const OWNER_EMAIL = "vishalpandey25288@gmail.com";

const ADMIN_EMAIL = "vmtournament20@gmail.com";



loginBtn.onclick = () => {

loginPopup.style.display = "flex";

};



googleLogin.onclick = async () => {

try{

const result = await signInWithPopup(auth, provider);

const user = result.user;

const email = user.email;

const uid = user.uid;



let role = "user";



if(email === OWNER_EMAIL){

role = "owner";

}

else if(email === ADMIN_EMAIL){

role = "admin";

}



const userRef = doc(db,"users",uid);

const userSnap = await getDoc(userRef);



if(!userSnap.exists()){

await setDoc(userRef,{

email:email,

role:role,

username:"",

wallet:0,

created:Date.now()

});

}



localStorage.setItem("uid",uid);

localStorage.setItem("email",email);

localStorage.setItem("role",role);



loginPopup.style.display="none";



checkUsername(uid);



}catch(e){

alert("Login Failed");

console.error(e);

}

};





async function checkUsername(uid){

const userRef = doc(db,"users",uid);

const snap = await getDoc(userRef);



const data = snap.data();



if(!data.username){

document.getElementById("usernamePopup").style.display="flex";

}

else{

loginBtn.innerText = data.username;

loginBtn.disabled = true;

}

}





window.saveUsername = async function(){

const username = document.getElementById("newUsername").value.trim();



if(username.length < 3){

alert("Username too short");

return;

}



const uid = localStorage.getItem("uid");



const userRef = doc(db,"users",uid);



await setDoc(userRef,{

username:username

},{merge:true});



document.getElementById("usernamePopup").style.display="none";



loginBtn.innerText = username;

loginBtn.disabled = true;

};





onAuthStateChanged(auth, async (user)=>{

if(user){

const uid = user.uid;

localStorage.setItem("uid",uid);



const userRef = doc(db,"users",uid);

const snap = await getDoc(userRef);



if(snap.exists()){

const data = snap.data();

loginBtn.innerText = data.username || "Account";

loginBtn.disabled = true;

}

}

});





window.logoutUser = async function(){

await signOut(auth);

localStorage.clear();

location.reload();

};
