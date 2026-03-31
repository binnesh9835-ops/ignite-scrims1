import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentUser = null;


// 🔐 LOAD USER
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    document.getElementById("email").value = user.email;

    const firstName = user.displayName
        ? user.displayName.split(" ")[0]
        : "";

    document.getElementById("name").value = firstName;

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
        const data = snap.data();

        document.getElementById("phone").value = data.phone || "";
        document.getElementById("ign").value = data.ign || "";
        document.getElementById("upi").value = data.upi || "";
        document.getElementById("upiName").value = data.upiName || "";
    }

});


// 💾 SAVE PROFILE
window.saveProfile = async function () {

    const phone = document.getElementById("phone").value.trim();
    const ign = document.getElementById("ign").value.trim();
    const upi = document.getElementById("upi").value.trim();
    const upiName = document.getElementById("upiName").value.trim();

    // 🔥 VALIDATION
    if (phone.length !== 10) {
        alert("Enter valid 10 digit phone number");
        return;
    }

    if (!ign || !upi || !upiName) {
        alert("All fields are required!");
        return;
    }

    await setDoc(doc(db, "users", currentUser.uid), {
        name: document.getElementById("name").value,
        email: currentUser.email,
        phone,
        ign,
        upi,
        upiName
    });

    alert("Profile Saved ✅");
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
