import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { joinMatch } from "./matches.js";


const homeSection = document.getElementById("home");


homeSection.innerHTML = 

<h2>Upcoming Matches</h2>

<div id="matchList">
Loading matches...
</div>

;


async function loadMatches(){

const snap = await getDocs(collection(db,"matches"));

const list = document.getElementById("matchList");

list.innerHTML = "";


if(snap.empty){

list.innerHTML = "No matches available";

return;

}


snap.forEach(docu=>{

const data = docu.data();

const matchId = docu.id;


const div = document.createElement("div");

div.style.border = "1px solid gray";

div.style.margin = "10px";

div.style.padding = "10px";


div.innerHTML = 

<b>Time:</b> ${data.time}

<br>

<b>Entry Fee:</b> ₹${data.entryFee}

<br>

<b>Prize:</b> ₹${data.prize}

<br><br>

<button id="join_${matchId}">
Join Match
</button>

;


list.appendChild(div);


document
.getElementById(join_${matchId})
.onclick = ()=>{

joinMatch(matchId);

};

});


}


loadMatches();
