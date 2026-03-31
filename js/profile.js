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

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    // 🟢 AUTO EMAIL + NAME
    document.getElementById("email").value = user.email;

    const firstName = user.displayName
        ? user.displayName.split(" ")[0]
        : "";

    document.getElementById("name").value = firstName;

    if (snap.exists()) {
        showProfile(snap.data());
    } else {
        document.getElementById("profileForm").classList.remove("hidden");
    }

});


// 💾 SAVE PROFILE
window.saveProfile = async function () {

    const data = {
        name: document.getElementById("name").value,
        email: currentUser.email,
        phone: document.getElementById("phone").value,
        ign: document.getElementById("ign").value,
        upi: document.getElementById("upi").value,
        upiName: document.getElementById("upiName").value
    };

    if (!data.ign) {
        alert("IGN required!");
        return;
    }

    await setDoc(doc(db, "users", currentUser.uid), data);

    showProfile(data);
};


// 👁️ SHOW PROFILE
function showProfile(data) {

    document.getElementById("profileForm").classList.add("hidden");
    document.getElementById("profileView").classList.remove("hidden");

    document.getElementById("vName").innerText = data.name;
    document.getElementById("vEmail").innerText = data.email;
    document.getElementById("vPhone").innerText = data.phone;
    document.getElementById("vIgn").innerText = data.ign;
}


// 🔓 LOGOUT CONFIRM
window.confirmLogout = function () {

    const ok = confirm("Are you sure you want to logout?");
    if (!ok) return;

    signOut(auth).then(() => {
        window.location.href = "login.html";
    });

};
