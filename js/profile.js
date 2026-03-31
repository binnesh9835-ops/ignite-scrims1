// 🔥 IMPORTS
import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentUser = null;


// 🔐 CHECK USER + LOAD DATA
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
        const data = snap.data();

        document.getElementById("name").value = data.name || "";
        document.getElementById("email").value = data.email || "";
        document.getElementById("phone").value = data.phone || "";
        document.getElementById("uid").value = data.uid || "";
        document.getElementById("ign").value = data.ign || "";
        document.getElementById("upi").value = data.upi || "";
    }

});


// 💾 SAVE PROFILE
window.saveProfile = async function () {

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const uid = document.getElementById("uid").value.trim();
    const ign = document.getElementById("ign").value.trim();
    const upi = document.getElementById("upi").value.trim();

    // ⚠️ VALIDATION
    if (!uid || !ign) {
        alert("UID and In-Game Name are required!");
        return;
    }

    try {

        const userRef = doc(db, "users", currentUser.uid);

        await updateDoc(userRef, {
            name,
            phone,
            uid,
            ign,
            upi
        });

        alert("Profile saved successfully ✅");

    } catch (error) {
        alert("Error: " + error.message);
    }
};
