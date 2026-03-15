import { auth, db } from "./firebase.js";

import {
doc,
getDoc,
collection,
addDoc,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const walletSection = document.getElementById("wallet");


walletSection.innerHTML = 

<h2>Wallet</h2>

<p>
Balance: ₹<span id="walletBalance">0</span>
</p>

<br>

<input id="addAmount" placeholder="Amount to Add">

<button id="addMoneyBtn">
Add Money
</button>

<br><br>

<input id="withdrawAmount" placeholder="Withdraw Amount">

<input id="withdrawUpi" placeholder="Your UPI ID">

<button id="withdrawBtn">
Withdraw
</button>

<br><br>

<h3>Transactions</h3>

<div id="transactionList"></div>

;


let currentUID = null;



onAuthStateChanged(auth, async (user)=>{

if(!user) return;

currentUID = user.uid;

loadWallet();

loadTransactions();

});



async function loadWallet(){

const userRef = doc(db,"users",currentUID);

const snap = await getDoc(userRef);



if(snap.exists()){

const data = snap.data();

document.getElementById("walletBalance").innerText = data.wallet || 0;

}

}



document.getElementById("addMoneyBtn").onclick = async ()=>{

const amount = Number(document.getElementById("addAmount").value);

if(amount < 20){

alert("Minimum add ₹20");

return;

}

await addDoc(collection(db,"transactions"),{

uid: currentUID,

type: "add",

amount: amount,

status: "pending",

time: Date.now()

});

alert("Add money request sent to admin");

};



document.getElementById("withdrawBtn").onclick = async ()=>{

const amount = Number(document.getElementById("withdrawAmount").value);

const upi = document.getElementById("withdrawUpi").value.trim();



if(amount < 200){

alert("Minimum withdraw ₹200");

return;

}



if(amount > 1000){

alert("Max withdraw ₹1000");

return;

}



await addDoc(collection(db,"transactions"),{

uid: currentUID,

type: "withdraw",

amount: amount,

upi: upi,

status: "pending",

time: Date.now()

});



alert("Withdraw request sent to admin");

};



async function loadTransactions(){

const q = query(

collection(db,"transactions"),

where("uid","==",currentUID)

);



const snap = await getDocs(q);

const list = document.getElementById("transactionList");

list.innerHTML = "";



snap.forEach(docu=>{

const d = docu.data();



const div = document.createElement("div");

div.style.border="1px solid gray";

div.style.margin="10px";

div.style.padding="10px";



div.innerHTML = 

Type: ${d.type} <br>

Amount: ₹${d.amount} <br>

Status: ${d.status}

;



list.appendChild(div);

});

}
