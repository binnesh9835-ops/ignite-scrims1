function googleLogin() {
    auth.signInWithPopup(provider)
    .then((result) => {
        let isNewUser = result.additionalUserInfo.isNewUser;

        if (isNewUser) {
            document.getElementById("welcomePopup").classList.remove("hidden");
        } else {
            window.location.href = "dashboard.html";
        }
    })
    .catch((error) => {
        alert(error.message);
    });
}

function closePopup() {
    window.location.href = "dashboard.html";
}
