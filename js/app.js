// 🔥 IMPORTS
import { auth, provider, db } from "./firebase.js";

import {
    signInWithPopup,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// 🔐 GOOGLE LOGIN
window.googleLogin = async function () {
    try {

        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        // 🆕 NEW USER
        if (!userSnap.exists()) {

            await setDoc(userRef, {
                name: user.displayName,
                email: user.email,
                phone: "",
                uid: "",
                ign: "",
                upi: "",
                balance: 0,
                winningBalance: 0,
                createdAt: new Date()
            });

            // show welcome popup
            document.getElementById("welcomePopup").classList.remove("hidden");

        } else {
            // existing user
            window.location.href = "dashboard.html";
        }

    } catch (error) {
        alert("Login Error: " + error.message);
    }
};


// 🎉 CLOSE POPUP → DASHBOARD
window.closePopup = function () {
    window.location.href = "dashboard.html";
};


// 🔄 AUTO LOGIN CHECK
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Logged in:", user.email);
    }
});
