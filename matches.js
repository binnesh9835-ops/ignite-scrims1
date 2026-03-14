import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const matchesContainer = document.getElementById("matchesContainer");



// LOAD MATCHES

async function loadMatches(){

matchesContainer.innerHTML = "";

const querySnapshot = await getDocs(collection(db,"matches"));

querySnapshot.forEach((doc)=>{

const match = doc.data();

createMatchCard(match);

});

}



function createMatchCard(match){

const card = document.createElement("div");

card.className = "match-card";



card.innerHTML = 
<img src="${match.thumbnail}" class="match-thumb">

<div class="match-info">
<h3>${match.title}</h3>
<p>Entry ₹${match.entry}</p>
<p>Slots ${match.joined}/${match.slots}</p>
<p>Time ${match.time}</p>
</div>
;



const joinBtn = document.createElement("button");

joinBtn.className = "join-btn";

joinBtn.innerText = "JOIN MATCH";



if(match.joined >= match.slots){

joinBtn.innerText = "MATCH FULL";

joinBtn.disabled = true;

}



joinBtn.onclick = () => {

alert("Join system next step me add hoga");

};



matchesContainer.appendChild(card);
matchesContainer.appendChild(joinBtn);

}



// RUN

loadMatches();
