import { auth, provider } from "./firebase.js";
import { signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔐 LOGIN
window.googleLogin = function () {
    signInWithPopup(auth, provider)
    .then((result) => {

        const isNewUser = result._tokenResponse.isNewUser;

        if (isNewUser) {
            document.getElementById("welcomePopup").classList.remove("hidden");
        } else {
            window.location.href = "dashboard.html";
        }

    })
    .catch((error) => {
        alert(error.message);
    });
};

// 🎉 CLOSE POPUP
window.closePopup = function () {
    window.location.href = "dashboard.html";
};

// 🔄 AUTO LOGIN
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Logged in:", user.email);
    }
});
