import { db } from "./firebase.js";

import {
collection,
getDocs,
updateDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const adminPanel=document.getElementById("adminPanel");

async function loadMatchesAdmin(){

const querySnapshot=await getDocs(collection(db,"matches"));

querySnapshot.forEach((docSnap)=>{

const match=docSnap.data();
const id=docSnap.id;

const box=document.createElement("div");

box.innerHTML=

<h4>${match.title}</h4>

<input id="room_${id}" placeholder="Room ID">

<input id="pass_${id}" placeholder="Password">

<button onclick="saveRoom('${id}')">Update Room</button>

<hr>

;

adminPanel.appendChild(box);

});

}

window.saveRoom=async(id)=>{

const room=document.getElementById("room_"+id).value;

const pass=document.getElementById("pass_"+id).value;

await updateDoc(doc(db,"matches",id),{

roomId:room,
roomPass:pass

});

alert("Room Updated");

};

loadMatchesAdmin();
