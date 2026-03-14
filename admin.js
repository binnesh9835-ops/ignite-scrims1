import { db } from "./firebase.js";

import {
collection,
addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const adminPanel = document.getElementById("adminPanel");



// ADD MATCH BUTTON

adminPanel.innerHTML += 
<h3>Create Match</h3>

<input id="matchTitle" placeholder="Match Title">

<input id="matchEntry" placeholder="Entry Fee">

<input id="matchSlots" placeholder="Total Slots">

<input id="matchTime" placeholder="Match Time">

<input id="matchThumb" placeholder="Thumbnail URL">

<button id="createMatch">Create Match</button>
;



document.getElementById("createMatch").onclick = async () => {

const title = document.getElementById("matchTitle").value;

const entry = document.getElementById("matchEntry").value;

const slots = document.getElementById("matchSlots").value;

const time = document.getElementById("matchTime").value;

const thumbnail = document.getElementById("matchThumb").value;



await addDoc(collection(db,"matches"),{

title:title,
entry:entry,
slots:Number(slots),
joined:0,
time:time,
thumbnail:thumbnail

});



alert("Match Created");

};
