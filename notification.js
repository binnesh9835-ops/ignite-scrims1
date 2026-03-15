import { auth, db } from "./firebase.js";

import {
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



let currentUID = null;



onAuthStateChanged(auth,(user)=>{

if(!user) return;

currentUID = user.uid;

loadNotifications();

});



async function loadNotifications(){

const q = query(

collection(db,"notifications"),

where("uid","==",currentUID)

);

const snap = await getDocs(q);



snap.forEach(docu=>{

const data = docu.data();



showNotification(data.message);

});

}



function showNotification(message){

const div = document.createElement("div");

div.style.position="fixed";

div.style.bottom="20px";

div.style.right="20px";

div.style.background="#1e1e1e";

div.style.padding="12px";

div.style.borderRadius="8px";

div.style.border="1px solid gray";

div.style.zIndex="999";



div.innerText = message;



document.body.appendChild(div);



setTimeout(()=>{

div.remove();

},6000);

}
