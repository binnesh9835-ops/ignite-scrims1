import { auth, db } from "./firebase.js";

import {
collection,
getDocs,
doc,
getDoc,
updateDoc,
addDoc,
query,
where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



let currentRole = null;



onAuthStateChanged(auth, async (user)=>{

if(!user) return;



const userRef = doc(db,"users",user.uid);

const snap = await getDoc(userRef);

const data = snap.data();



currentRole = data.role;



if(currentRole === "admin" || currentRole === "owner"){

loadAdminPanel();

}

});



async function loadAdminPanel(){

const home = document.getElementById("home");



const panel = document.createElement("div");

panel.style.border="2px solid red";

panel.style.padding="10px";

panel.style.margin="10px";



panel.innerHTML = 

<h2>Admin Panel</h2>

<h3>Create Match</h3>

<input id="matchTime" placeholder="Match Time">

<input id="matchEntry" placeholder="Entry Fee">

<input id="matchPrize" placeholder="Prize">

<button id="createMatchBtn">Create Match</button>

<br><br>

<h3>Wallet Requests</h3>

<div id="walletRequests">Loading...</div>

;



home.prepend(panel);



document.getElementById("createMatchBtn").onclick=createMatch;



loadWalletRequests();

}



async function createMatch(){

const time=document.getElementById("matchTime").value;

const entry=Number(document.getElementById("matchEntry").value);

const prize=Number(document.getElementById("matchPrize").value);



await addDoc(collection(db,"matches"),{

time:time,

entryFee:entry,

prize:prize,

roomId:"",

roomPass:""

});



alert("Match created");

}



async function loadWalletRequests(){

const q = query(

collection(db,"transactions"),

where("status","==","pending")

);



const snap = await getDocs(q);

const box = document.getElementById("walletRequests");

box.innerHTML="";



snap.forEach(async docu=>{

const d = docu.data();

const id = docu.id;



const div=document.createElement("div");

div.style.border="1px solid gray";

div.style.margin="10px";

div.style.padding="10px";



div.innerHTML=

Type: ${d.type} <br>

Amount: ₹${d.amount} <br>

User: ${d.uid}

<br><br>

<button id="approve_${id}">
Approve
</button>

<button id="reject_${id}">
Reject
</button>

;



box.appendChild(div);



document.getElementById(approve_${id}).onclick=()=>approveTransaction(id,d);

document.getElementById(reject_${id}).onclick=()=>rejectTransaction(id,d);

});

}



async function approveTransaction(id,data){

const ref = doc(db,"transactions",id);



await updateDoc(ref,{

status:"approved"

});



if(data.type==="add"){

const userRef = doc(db,"users",data.uid);

const snap = await getDoc(userRef);

const u = snap.data();



await updateDoc(userRef,{

wallet: (u.wallet||0) + data.amount

});



await addDoc(collection(db,"notifications"),{

uid:data.uid,

message:₹${data.amount} added to wallet,

time:Date.now()

});

}



if(data.type==="withdraw"){

await addDoc(collection(db,"notifications"),{

uid:data.uid,

message:Withdraw ₹${data.amount} approved,

time:Date.now()

});

}



alert("Approved");

loadWalletRequests();

}



async function rejectTransaction(id,data){

const ref = doc(db,"transactions",id);



await updateDoc(ref,{

status:"rejected"

});



await addDoc(collection(db,"notifications"),{

uid:data.uid,

message:Transaction rejected,

time:Date.now()

});



alert("Rejected");

loadWalletRequests();

}
