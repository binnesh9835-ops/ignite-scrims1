import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// 🔐 LOAD USER DATA IN DASHBOARD
onAuthStateChanged(auth, async (user) => {

    if (!user) return;

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


// 🔧 EDIT PROFILE PAGE OPEN
window.openEditProfile = function () {
    window.location.href = "profile.html";
};


// 📞 TELEGRAM
window.openTelegram = function () {
    window.open("https://t.me/IgniteScrimsFF_Support", "_blank");
};


// 🔓 LOGOUT
window.logoutUser = function () {

    const ok = confirm("Logout?");
    if (!ok) return;

    signOut(auth).then(() => {
        window.location.href = "login.html";
    });
};
