import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentUser = null;
// 🔐 AUTO LOAD USER DATA (SAFE)
onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    currentUser = user; // ✅ IMPORTANT FIX

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {

    const data = snap.data();

    // ✅ creator request check
    if(data.creatorRequest){
        const btn = document.getElementById("creatorBtn");
        if(btn){
            btn.disabled = true;
            btn.innerText = "Request Sent ⏳";
        }
    }
}

        // ✅ SAFE CHECK (important)
        if (document.getElementById("pName"))
            document.getElementById("pName").innerText = data.name || "";

        if (document.getElementById("pEmail"))
            document.getElementById("pEmail").innerText = data.email || "";

        if (document.getElementById("pPhone"))
            document.getElementById("pPhone").innerText = data.phone || "";

        if (document.getElementById("pIgn"))
            document.getElementById("pIgn").innerText = data.ign || "";
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

    signOut(auth).then(() => {

        const btn = document.getElementById("startBtn");
        if(btn) btn.style.display = "block";

        location.reload();
    });

};

window.openCreatorVerify = function(){
    document.getElementById("creatorPopup").classList.add("show");
};

window.closeCreator = function(){
    document.getElementById("creatorPopup").classList.remove("show");
};

window.submitCreator = async function(){

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

    document.getElementById("creatorBtn").disabled = true;
};
