// 🔐 GOOGLE LOGIN FUNCTION
function googleLogin() {
    auth.signInWithPopup(provider)
    .then((result) => {

        const user = result.user;
        const isNewUser = result.additionalUserInfo.isNewUser;

        console.log("User:", user);

        // 🆕 FIRST TIME USER
        if (isNewUser) {
            document.getElementById("welcomePopup").classList.remove("hidden");
        } 
        // 🔁 EXISTING USER
        else {
            window.location.href = "dashboard.html";
        }

    })
    .catch((error) => {
        console.error(error);
        alert("Login failed: " + error.message);
    });
}

// 🎉 CLOSE POPUP
function closePopup() {
    window.location.href = "dashboard.html";
}

// 🔄 AUTO LOGIN CHECK (optional but useful)
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("Already logged in:", user.email);
    }
});
