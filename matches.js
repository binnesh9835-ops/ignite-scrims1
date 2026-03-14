import { db } from "./firebase.js";

import {
collection,
getDocs,
addDoc,
updateDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const matchesContainer=document.getElementById("matchesContainer");

let currentMatchId=null;



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



const joinBtn=document.createElement("button");

joinBtn.className="join-btn";

joinBtn.innerText="JOIN MATCH";



if(match.joined>=match.slots){

joinBtn.innerText="MATCH FULL";
joinBtn.disabled=true;

}



joinBtn.onclick=()=>{

currentMatchId=matchId;

document.getElementById("entryFee").innerText=match.entry;

document.getElementById("joinPopup").style.display="flex";

};



matchesContainer.appendChild(card);
matchesContainer.appendChild(joinBtn);

}



loadMatches();



// RULES → PLAYER

document.getElementById("agreeBtn").onclick=()=>{

document.getElementById("stepRules").style.display="none";
document.getElementById("stepPlayer").style.display="block";

};



// PLAYER → PAYMENT

document.getElementById("nextToPayment").onclick=()=>{

document.getElementById("stepPlayer").style.display="none";
document.getElementById("stepPayment").style.display="block";

};



// BACK BUTTONS

document.getElementById("backToRules").onclick=()=>{

document.getElementById("stepPlayer").style.display="none";
document.getElementById("stepRules").style.display="block";

};



document.getElementById("backToPlayer").onclick=()=>{

document.getElementById("stepPayment").style.display="none";
document.getElementById("stepPlayer").style.display="block";

};



// PAYMENT SUBMIT

document.getElementById("submitJoin").onclick=async()=>{

const ign=document.getElementById("joinIGN").value;
const uid=document.getElementById("joinUID").value;
const level=document.getElementById("joinLevel").value;
const ref=document.getElementById("upiRef").value;

if(!ign!uid!ref){

alert("Fill all details");
return;

}



// save request

await addDoc(collection(db,"match_requests"),{

matchId:currentMatchId,
ign:ign,
uid:uid,
level:level,
ref:ref,
status:"pending",
time:Date.now()

});



document.getElementById("joinStatus").innerText="⏳ Slot reserved temporarily. Waiting for admin approval.";

};
