// 🔥 IMPORTS
import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const ADMIN_EMAIL = "vishalpandey25288@gmail.com";

let currentUser = null;


// 🔐 ADMIN EMAILS LIST
const ADMIN_EMAILS = [
  "vishalpandey25288@gmail.com"
  // future me yaha aur add kar sakta hai
  // "example@gmail.com"
];

// 🔐 ADMIN CHECK
onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    if (user.email !== ADMIN_EMAIL) {
        alert("Access Denied ❌");
        window.location.href = "dashboard.html";
        return;
    }

    currentUser = user;
});


// 🔓 LOGOUT
window.logout = function () {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    });
};


// 🎮 CREATE MATCH
window.createMatch = async function () {

    const mode = document.getElementById("mode").value;
    const entry = Number(document.getElementById("entry").value);
    const perKill = Number(document.getElementById("perKill").value);
    const booyah = Number(document.getElementById("booyah").value);
    const slots = Number(document.getElementById("slots").value);
    const time = document.getElementById("time").value;

    try {

        await addDoc(collection(db, "matches"), {
            mode,
            entry,
            perKill,
            booyah,
            totalSlots: slots,
            time,
            createdAt: new Date()
        });

        alert("Match Created ✅");

    } catch (err) {
        alert(err.message);
    }
};


// 🏆 CREATE TOURNAMENT
window.createTournament = async function () {

    const mode = document.getElementById("tMode").value;
    const entry = Number(document.getElementById("tEntry").value);
    const matches = Number(document.getElementById("tMatches").value);
    const perKill = Number(document.getElementById("tKill").value);

    try {

        await addDoc(collection(db, "tournaments"), {
            mode,
            entry,
            totalMatches: matches,
            perKillPoint: perKill,
            createdAt: new Date()
        });

        alert("Tournament Created ✅");

    } catch (err) {
        alert(err.message);
    }
};


// 📊 LOAD MATCH PLAYERS
window.loadPlayers = async function () {

    const matchId = document.getElementById("matchIdInput").value;

    const list = document.getElementById("playerList");
    list.innerHTML = "";

    const ref = collection(db, "matches", matchId, "players");
    const snap = await getDocs(ref);

    snap.forEach(docSnap => {

        const p = docSnap.data();

        const row = document.createElement("div");
        row.className = "admin-row";

        row.innerHTML = `
            <p>Slot ${p.slot} - ${p.teamName}</p>
            <input type="number" placeholder="Kills" id="kills-${docSnap.id}">
            <input type="checkbox" id="booyah-${docSnap.id}">
            <button onclick="savePlayer('${matchId}', '${docSnap.id}')">Save</button>
        `;

        list.appendChild(row);
    });
};


// 💾 SAVE PLAYER DATA (MATCH)
window.savePlayer = async function (matchId, playerId) {

    const kills = Number(document.getElementById(`kills-${playerId}`).value);
    const booyah = document.getElementById(`booyah-${playerId}`).checked;

    const ref = doc(db, "matches", matchId, "players", playerId);

    try {

        await updateDoc(ref, {
            kills,
            booyah
        });

        alert("Updated ✅");

    } catch (err) {
        alert(err.message);
    }
};


// 🏆 LOAD TOURNAMENT TEAMS
window.loadTeams = async function () {

    const tId = document.getElementById("tournamentIdInput").value;

    const list = document.getElementById("teamList");
    list.innerHTML = "";

    const ref = collection(db, "tournaments", tId, "teams");
    const snap = await getDocs(ref);

    snap.forEach(docSnap => {

        const t = docSnap.data();

        const row = document.createElement("div");
        row.className = "admin-row";

        row.innerHTML = `
            <p>${t.teamName}</p>
            <input type="number" placeholder="Kills" id="tk-${docSnap.id}">
            <input type="number" placeholder="Placement (1-10)" id="tp-${docSnap.id}">
            <button onclick="saveTournament('${tId}', '${docSnap.id}')">Save</button>
        `;

        list.appendChild(row);
    });
};


// 💾 SAVE TOURNAMENT DATA
window.saveTournament = async function (tId, teamId) {

    const kills = Number(document.getElementById(`tk-${teamId}`).value);
    const placement = Number(document.getElementById(`tp-${teamId}`).value);

    const ref = doc(db, "tournaments", tId, "teams", teamId);

    // 🧠 POINT SYSTEM
    let placementPoints = 0;

    if (placement === 1) placementPoints = 15;
    else if (placement === 2) placementPoints = 12;
    else if (placement === 3) placementPoints = 10;
    else placementPoints = 5;

    const killPoints = kills * 2;
    const total = killPoints + placementPoints;

    try {

        await updateDoc(ref, {
            totalKills: kills,
            totalPoints: total,
            wins: placement === 1 ? 1 : 0
        });

        alert("Tournament Updated ✅");

    } catch (err) {
        alert(err.message);
    }
};
