import { auth, db } from "./firebase.js";

import {
collection,
doc,
getDoc,
getDocs,
updateDoc,
addDoc,
query,
where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



const matchesSection = document.getElementById("matches");


matchesSection.innerHTML = 

<h2>My Matches</h2>

<div id="myMatchesList">
No matches joined
</div>

;


let currentUID = null;



onAuthStateChanged(auth,(user)=>{

if(!user) return;

currentUID = user.uid;

loadMyMatches();

});



async function loadMyMatches(){

const q = query(

collection(db,"matchPlayers"),

where("uid","==",currentUID)

);

const snap = await getDocs(q);

const list = document.getElementById("myMatchesList");

list.innerHTML = "";



if(snap.empty){

list.innerHTML = "No matches joined";

return;

}



for(const d of snap.docs){

const data = d.data();

const matchRef = doc(db,"matches",data.matchId);

const matchSnap = await getDoc(matchRef);



if(!matchSnap.exists()) continue;



const match = matchSnap.data();



const div = document.createElement("div");

div.style.border="1px solid gray";

div.style.margin="10px";

div.style.padding="10px";



div.innerHTML = 

<b>Match Time:</b> ${match.time}

<br>

<b>Entry Fee:</b> ₹${match.entryFee}

<br>

<b>Prize:</b> ₹${match.prize}

<br>

<b>Room ID:</b> ${match.roomId || "Not released"}

<br>

<b>Password:</b> ${match.roomPass || "Not released"}

<br>

Kills: ${data.kills || 0}

<br>

Reward Collected: ${data.rewardCollected ? "Yes" : "No"}

;


list.appendChild(div);

}

}




export async function joinMatch(matchId){

const uid = auth.currentUser.uid;



const userRef = doc(db,"users",uid);

const userSnap = await getDoc(userRef);

const userData = userSnap.data();



const matchRef = doc(db,"matches",matchId);

const matchSnap = await getDoc(matchRef);

const matchData = matchSnap.data();



if(userData.wallet < matchData.entryFee){

alert("Not enough wallet balance");

return;

}



await updateDoc(userRef,{

wallet: userData.wallet - matchData.entryFee

});



await addDoc(collection(db,"matchPlayers"),{

uid: uid,

matchId: matchId,

kills: 0,

rewardCollected: false

});



alert("Match joined successfully");

loadMyMatches();

}
