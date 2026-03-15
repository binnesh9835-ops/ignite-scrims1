import { auth, db } from "./firebase.js";

import {
GoogleAuthProvider,
signInWithPopup,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
doc,
getDoc,
setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const provider = new GoogleAuthProvider();

const googleBtn = document.getElementById("googleLogin");


googleBtn.onclick = async () => {

try{

const result = await signInWithPopup(auth, provider);

const user = result.user;

const userRef = doc(db,"users",user.uid);

const snap = await getDoc(userRef);


if(!snap.exists()){

document.getElementById("usernamePopup").style.display="flex";

}else{

location.reload();

}

}catch(err){

alert(err.message);

}

};



onAuthStateChanged(auth, async (user)=>{

if(!user) return;

const userRef = doc(db,"users",user.uid);

const snap = await getDoc(userRef);


if(!snap.exists()){

document.getElementById("usernamePopup").style.display="flex";

}

});



window.saveUsername = async function(){

const username = document.getElementById("newUsername").value.trim();

const user = auth.currentUser;


if(!username){

alert("Enter username");

return;

}


await setDoc(doc(db,"users",user.uid),{

username:username,
wallet:0,
ign:"",
ffuid:"",
level:0,
role:"user"

});


location.reload();

}
