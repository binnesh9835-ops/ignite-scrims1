import { db } from "./firebase.js";

import {
collection,
getDocs,
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const matchesContainer = document.getElementById("matchesContainer");

async function loadMatches(){

matchesContainer.innerHTML="";

const querySnapshot=await getDocs(collection(db,"matches"));

querySnapshot.forEach((docSnap)=>{

const match=docSnap.data();
const matchId=docSnap.id;

createMatchCard(match,matchId);

});

}

function createMatchCard(match,matchId){

const card=document.createElement("div");

card.className="match-card";

card.innerHTML=

<img src="${match.thumbnail}" class="match-thumb">

<div class="match-info">

<h3>${match.title}</h3>

<p>Entry ₹${match.entry}</p>

<p>Slots ${match.joined}/${match.slots}</p>

<p>Time ${match.time}</p>

</div>

;

const roomBtn=document.createElement("button");

roomBtn.innerText="VIEW ROOM";

roomBtn.onclick=()=>{

showRoom(matchId);

};

matchesContainer.appendChild(card);

matchesContainer.appendChild(roomBtn);

}

loadMatches();



async function showRoom(matchId){

const matchRef=doc(db,"matches",matchId);

const matchSnap=await getDoc(matchRef);

const data=matchSnap.data();



if(!data.roomId){

alert("Room not available yet");
return;

}



document.getElementById("roomIdText").innerText=data.roomId;

document.getElementById("roomPassText").innerText=data.roomPass;

document.getElementById("roomPopup").style.display="flex";

}



window.closeRoom=()=>{

document.getElementById("roomPopup").style.display="none";

};
