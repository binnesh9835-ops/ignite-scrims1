// 🔥 IMPORTS
import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// 🔐 USER CHECK
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // 👤 USER DATA
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const data = userSnap.data();

        const nameEl = document.getElementById("userName");
const emailEl = document.getElementById("userEmail");
const balanceEl = document.getElementById("balance");
const winEl = document.getElementById("winning");

if(nameEl) nameEl.innerText = data.name || "";
if(emailEl) emailEl.innerText = data.email || "";
if(balanceEl) balanceEl.innerText = data.balance || 0;
if(winEl) winEl.innerText = data.winningBalance || 0;

    // 🔥 LOAD REAL DATA
    loadMatches("all");
    loadTournaments("all");



// 🔓 LOGOUT
window.logout = function () {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    });
};


// 🔁 SECTION SWITCH
window.showSection = function (id) {
    document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
    document.getElementById(id).classList.add("active");
};


// 🎮 MATCH TAB
window.switchTab = function (type) {

    document.querySelectorAll("#matches .tab").forEach(btn=>{
        btn.classList.remove("active");
    });

    event.target.classList.add("active");

    loadMatches(type);
};

// 🏆 TOURNAMENT TAB
window.switchTournamentTab = function (type) {

    document.querySelectorAll("#tournaments .tab").forEach(btn=>{
        btn.classList.remove("active");
    });

    event.target.classList.add("active");

    loadTournaments(type);
};


// =============================
// 🎮 LOAD MATCHES (REAL)
// =============================
async function loadMatches(type) {

    const container = document.getElementById("matchList");
    container.innerHTML = "Loading...";

const q = query(collection(db, "matches"), orderBy("createdAt", "desc"));
const snap = await getDocs(q);
    container.innerHTML = "";

    if (snap.empty) {
        container.innerHTML = "No matches available ❌";
        return;
    }

    snap.forEach(docSnap => {

        const m = docSnap.data();

        if (type !== "all" && m.mode.toLowerCase() !== type) return;

        const card = `
        <div class="card">
            <p>🎮 ${m.mode} Match</p>
            <p>Entry: ₹${m.entry}</p>
            <p>Time: ${m.time}</p>

            <button onclick="openMatch('${docSnap.id}')">
                Join
            </button>
        </div>
        `;

        container.innerHTML += card;
    });
}


// =============================
// 🏆 LOAD TOURNAMENTS (REAL)
// =============================
async function loadTournaments(type) {

    const container = document.getElementById("tournamentList");
    container.innerHTML = "Loading...";

    const snap = await getDocs(collection(db, "tournaments"));

    container.innerHTML = "";

    if (snap.empty) {
        container.innerHTML = "No tournaments available ❌";
        return;
    }

    snap.forEach(docSnap => {

        const t = docSnap.data();

        if (type !== "all" && t.mode.toLowerCase() !== type) return;

        const card = `
<div class="card gold auto-shine">
    <p>🏆 ${t.mode} Tournament</p>
    <p>Entry: ₹${t.entry}</p>

    <button onclick="openTournament('${docSnap.id}')">
        Join
    </button>
</div>
`;
        container.innerHTML += card;
    });
}

// 🔘 OPEN MATCH PAGE
window.openMatch = function(id){
    window.location.href = "match.html?id=" + id;
};

// 🔘 OPEN TOURNAMENT
window.openTournament = function(id){
    window.location.href = "tournament.html?id=" + id;
};


// 🔗 NAV
window.goWallet = () => window.location.href = "wallet.html";
window.goProfile = () => window.location.href = "profile.html";


// 🔥 DEFAULT TAB SET
setTimeout(() => {

    const matchAll = document.querySelector("#matches .tab");
    if(matchAll) matchAll.classList.add("active");

    const tourAll = document.querySelector("#tournaments .tab");
    if(tourAll) tourAll.classList.add("active");

}, 500);
