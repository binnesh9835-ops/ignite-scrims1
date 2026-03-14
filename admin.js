import { db } from "./firebase.js";

import {
collection,
getDocs,
updateDoc,
doc,
deleteDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const adminPanel=document.getElementById("adminPanel");



async function loadRequests(){

const querySnapshot=await getDocs(collection(db,"match_requests"));

querySnapshot.forEach((docSnap)=>{

const data=docSnap.data();
const id=docSnap.id;

if(data.status!=="pending") return;

const box=document.createElement("div");

box.innerHTML=

<p><b>IGN:</b> ${data.ign}</p>

<p>UID: ${data.uid}</p>

<p>Ref ID: ${data.ref}</p>

<button onclick="approve('${id}','${data.matchId}')">Approve</button>

<button onclick="reject('${id}','${data.matchId}')">Reject</button>

<hr>

;

adminPanel.appendChild(box);

});

}



window.approve=async(id,matchId)=>{

await updateDoc(doc(db,"match_requests",id),{

status:"approved"

});

alert("Payment Approved");

};



window.reject=async(id,matchId)=>{

const matchRef=doc(db,"matches",matchId);

const matchSnap=await getDoc(matchRef);

const matchData=matchSnap.data();



// SLOT -1

await updateDoc(matchRef,{
joined: matchData.joined - 1
});



await deleteDoc(doc(db,"match_requests",id));

alert("Payment Rejected");

};



loadRequests();
