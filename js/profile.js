import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentUser = null;

// 🔐 AUTO LOAD USER DATA
onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    currentUser = user;

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();

    // 👤 PROFILE DATA SHOW
    const nameEl = document.getElementById("pName");
    const emailEl = document.getElementById("pEmail");
    const phoneEl = document.getElementById("pPhone");
    const ignEl = document.getElementById("pIgn");

    if(nameEl) nameEl.innerText = data.name || "Not set";
    if(emailEl) emailEl.innerText = data.email || "Not set";
    if(phoneEl) phoneEl.innerText = data.phone || "Not set";

    if(ignEl){
        if(data.isCreator){
            ignEl.innerHTML = `<span class="creator-glow">${data.ign} (creator)</span>`;
        } else {
            ignEl.innerText = data.ign || "Not set";
        }
    }

    // ⭐ CREATOR BUTTON
    const btn = document.getElementById("creatorBtn");

    if(btn && data.creatorRequest){

        btn.disabled = true;

        if(data.creatorRequest.status === "pending"){
            btn.innerText = "Request Sent ⏳";
        }
        else if(data.creatorRequest.status === "approved"){
            btn.innerText = "Verified Creator ✅";
        }
        else if(data.creatorRequest.status === "rejected"){
            btn.innerText = "Rejected ❌ (Retry after 14 days)";
            btn.disabled = false; // 🔥 retry allowed
        }
    }
});


// 🔧 EDIT PROFILE
window.openEditProfile = function () {
    window.location.href = "profile.html";
};


// 📞 TELEGRAM
window.openTelegram = function () {
    window.open("https://t.me/IgniteScrimsFF_Support", "_blank");
};


// 🔓 LOGOUT
window.logoutUser = function () {

    const ok = confirm("Are you sure you want to logout?");
    if (!ok) return;

    signOut(auth).then(() => location.reload());
};


// ⭐ CREATOR POPUP
window.openCreatorVerify = function(){
    document.getElementById("creatorPopup").classList.add("show");
};

window.closeCreator = function(){
    document.getElementById("creatorPopup").classList.remove("show");
};


// 🚀 SUBMIT CREATOR
window.submitCreator = async function(){

    if(!currentUser){
        alert("User not loaded ❌");
        return;
    }

    const link = document.getElementById("channelLink").value;
    const subs = Number(document.getElementById("subs").value);
    const views = Number(document.getElementById("views").value);

    if(!link || !subs || !views){
        alert("Fill all fields ❌");
        return;
    }

    const userRef = doc(db,"users",currentUser.uid);

    await updateDoc(userRef,{
        creatorRequest:{
            status:"pending",
            channelLink:link,
            subscribers:subs,
            views:views,
            appliedAt:new Date()
        }
    });

    alert("Request Sent 🚀");

    closeCreator();

    const btn = document.getElementById("creatorBtn");
    if(btn){
        btn.disabled = true;
        btn.innerText = "Request Sent ⏳";
    }
};
