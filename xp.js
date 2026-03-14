import { db } from "./firebase.js";

import {
collection,
getDocs,
query,
orderBy,
limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const topPlayersDiv = document.getElementById("topPlayers");



// LOAD TOP PLAYERS

async function loadTopPlayers(){

const q = query(

collection(db,"users"),

orderBy("xp","desc"),

limit(100)

);



const querySnapshot = await getDocs(q);

topPlayersDiv.innerHTML = "";

let rank = 1;

querySnapshot.forEach((doc)=>{

const user = doc.data();

let nameClass = "";



// SHINE EFFECT UNLOCK

if(user.xp >= 7000){

nameClass = "xp-shine";

}



topPlayersDiv.innerHTML += 

<div class="player ${nameClass}">

#${rank} ${user.username} — XP ${user.xp}

</div>

;



rank++;

});

}



loadTopPlayers();
