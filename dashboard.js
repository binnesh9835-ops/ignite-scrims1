// 🔥 IMPORTS
import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// 🔐 CHECK USER
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // 🧾 FETCH USER DATA
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const data = userSnap.data();

        document.getElementById("userName").innerText = data.name || "";
        document.getElementById("userEmail").innerText = data.email || "";
        document.getElementById("balance").innerText = data.balance || 0;
        document.getElementById("winning").innerText = data.winningBalance || 0;
    }

});


// 🔓 LOGOUT
window.logout = function () {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    });
};


// 🔁 SECTION SWITCH
window.showSection = function (id) {

    document.querySelectorAll(".section").forEach(sec => {
        sec.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");

    // nav active
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    event.target.classList.add("active");
};


// 🎮 MATCH TAB SWITCH
window.switchTab = function (type) {

    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.remove("active");
    });

    event.target.classList.add("active");

    loadMatches(type);
};


// 🏆 TOURNAMENT TAB SWITCH
window.switchTournamentTab = function (type) {

    document.querySelectorAll("#tournamentSection .tab").forEach(tab => {
        tab.classList.remove("active");
    });

    event.target.classList.add("active");

    loadTournaments(type);
};


// 🎴 LOAD MATCHES (DUMMY FOR NOW)
function loadMatches(type) {

    const container = document.getElementById("matchList");
    container.innerHTML = "";

    const matches = [
        { mode: "solo", entry: 10 },
        { mode: "duo", entry: 30 },
        { mode: "squad", entry: 80 }
    ];

    matches.forEach(m => {

        if (type !== "all" && m.mode !== type) return;

        const card = `
        <div class="card">
            <p>${m.mode.toUpperCase()} Match</p>
            <p>Entry: ₹${m.entry}</p>
            <button onclick="joinMatch('${m.mode}')">Join</button>
        </div>
        `;

        container.innerHTML += card;
    });
}


// 🏆 LOAD TOURNAMENTS (DUMMY)
function loadTournaments(type) {

    const container = document.getElementById("tournamentList");
    container.innerHTML = "";

    const tournaments = [
        { mode: "squad", entry: 200 },
        { mode: "duo", entry: 80 }
    ];

    tournaments.forEach(t => {

        if (type !== "all" && t.mode !== type) return;

        const card = `
        <div class="card">
            <p>${t.mode.toUpperCase()} Tournament</p>
            <p>Entry: ₹${t.entry}</p>
            <button onclick="joinTournament('${t.mode}')">Join</button>
        </div>
        `;

        container.innerHTML += card;
    });
}


// 🔘 JOIN MATCH
window.joinMatch = function (mode) {
    alert("Join " + mode + " match (next step me popup banega)");
};


// 🔘 JOIN TOURNAMENT
window.joinTournament = function (mode) {
    alert("Join " + mode + " tournament (next step me banega)");
};


// 🔗 NAVIGATION
window.goWallet = function () {
    window.location.href = "wallet.html";
};

window.goProfile = function () {
    window.location.href = "profile.html";
};


// 🔥 DEFAULT LOAD
loadMatches("all");
loadTournaments("all");
