import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// 🔐 AUTO LOAD USER DATA
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        // ❌ Agar login nahi hai → dashboard pe hi rehne de (normal mode)
        return;
    }

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {

        const data = snap.data();

        document.getElementById("pName").innerText = data.name || "";
        document.getElementById("pEmail").innerText = data.email || "";
        document.getElementById("pPhone").innerText = data.phone || "";
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


// 🔓 LOGOUT (WITH CONFIRM)
window.logoutUser = function () {

    const ok = confirm("Are you sure you want to logout?");
    if (!ok) return;

    signOut(auth).then(() => {

        // 🔥 Logout ke baad start button wapas dikhega
        const btn = document.getElementById("startBtn");
        if(btn) btn.style.display = "block";

        // 🔥 optional redirect
        location.reload();
    });

};
