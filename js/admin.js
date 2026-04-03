console.log("admin loaded");

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


// 🔐 ADMIN EMAILS (FUTURE READY)
const ADMIN_EMAILS = [
    "vishalpandey25288@gmail.com"
    // future:
    // "admin2@gmail.com"
];

let currentUser = null;


// =============================
// 🔐 ADMIN AUTH CHECK
// =============================
onAuthStateChanged(auth, (user) => {

    if (!user) {
        alert("Login required");
        window.location.href = "index.html";
        return;
    }

    if (!ADMIN_EMAILS.includes(user.email)) {
        alert("Access Denied ❌ (Not Admin)");
        window.location.href = "dashboard.html";
        return;
    }

    currentUser = user;

    // ✅ LOAD ALL STATS
    loadAdminStats();
});


// =============================
// 🔓 LOGOUT
// =============================
window.logout = function () {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    });
};


// =============================
// 📊 ADMIN STATS SYSTEM
// =============================

// 📅 MONTH RANGE
function getMonthRange(){
    const now = new Date();

    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth()+1, 0, 23,59,59);

    return { start, end };
}


// 🔁 SAFE DATE CONVERTER (IMPORTANT)
function parseDate(d){
    if(!d) return null;
    return d.toDate ? d.toDate() : d; // supports both Timestamp & JS Date
}


// 👤 MONTHLY USERS
async function loadMonthlyUsers(){

    const { start, end } = getMonthRange();
    const snap = await getDocs(collection(db, "users"));

    let count = 0;

    snap.forEach(docSnap => {
        const d = docSnap.data();

        const date = parseDate(d.createdAt);

        if(date && date >= start && date <= end){
            count++;
        }
    });

    const el = document.getElementById("monthlyUsers");
    if(el) el.innerText = count;
}


// 💰 MONTHLY TRANSACTIONS
async function loadMonthlyTransactions(){

    const { start, end } = getMonthRange();
    const snap = await getDocs(collection(db, "transactions"));

    let total = 0;

    snap.forEach(docSnap => {
        const d = docSnap.data();

        const date = parseDate(d.createdAt);

        if(date && date >= start && date <= end){
            total += Number(d.amount || 0);
        }
    });

    const el = document.getElementById("monthlyAmount");
    if(el) el.innerText = total;
}


// ⏳ PENDING COUNT
async function loadPending(){

    const snap = await getDocs(collection(db, "transactions"));

    let count = 0;

    snap.forEach(docSnap => {
        const d = docSnap.data();

        if(d.status === "pending"){
            count++;
        }
    });

    const el = document.getElementById("pendingCount");
    if(el) el.innerText = count;
}


// 🚀 LOAD ALL
async function loadAdminStats(){
    await loadMonthlyUsers();
    await loadMonthlyTransactions();
    await loadPending();
}


// =============================
// 🎮 CREATE MATCH
// =============================
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


// =============================
// 🏆 CREATE TOURNAMENT
// =============================
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


// =============================
// 👥 MATCH PLAYERS
// =============================
window.loadPlayers = async function () {

    const matchId = document.getElementById("matchIdInput").value;

    const list = document.getElementById("playerList");
    list.innerHTML = "";

    const ref = collection(db, "matches", matchId, "players");
    const snap = await getDocs(ref);

    snap.forEach(docSnap => {

        const p = docSnap.data();

        const row = document.createElement("div");

        row.innerHTML = `
            <p>Slot ${p.slot} - ${p.teamName}</p>
            <input type="number" placeholder="Kills" id="kills-${docSnap.id}">
            <input type="checkbox" id="booyah-${docSnap.id}">
            <button onclick="savePlayer('${matchId}', '${docSnap.id}')">Save</button>
        `;

        list.appendChild(row);
    });
};


// 💾 SAVE PLAYER
window.savePlayer = async function (matchId, playerId) {

    const kills = Number(document.getElementById(`kills-${playerId}`).value);
    const booyah = document.getElementById(`booyah-${playerId}`).checked;

    const ref = doc(db, "matches", matchId, "players", playerId);

    try {
        await updateDoc(ref, { kills, booyah });
        alert("Updated ✅");
    } catch (err) {
        alert(err.message);
    }
};


// =============================
// 🏆 TOURNAMENT TEAMS
// =============================
window.loadTeams = async function () {

    const tId = document.getElementById("tournamentIdInput").value;

    const list = document.getElementById("teamList");
    list.innerHTML = "";

    const ref = collection(db, "tournaments", tId, "teams");
    const snap = await getDocs(ref);

    snap.forEach(docSnap => {

        const t = docSnap.data();

        const row = document.createElement("div");

        row.innerHTML = `
            <p>${t.teamName}</p>
            <input type="number" placeholder="Kills" id="tk-${docSnap.id}">
            <input type="number" placeholder="Placement" id="tp-${docSnap.id}">
            <button onclick="saveTournament('${tId}', '${docSnap.id}')">Save</button>
        `;

        list.appendChild(row);
    });
};


// 💾 SAVE TOURNAMENT
window.saveTournament = async function (tId, teamId) {

    const kills = Number(document.getElementById(`tk-${teamId}`).value);
    const placement = Number(document.getElementById(`tp-${teamId}`).value);

    const ref = doc(db, "tournaments", tId, "teams", teamId);

    let placementPoints = 0;

    if (placement === 1) placementPoints = 15;
    else if (placement === 2) placementPoints = 12;
    else if (placement === 3) placementPoints = 10;
    else placementPoints = 5;

    const total = (kills * 2) + placementPoints;

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

// =============================
// ⏳ OPEN PENDING POPUP
// =============================
window.openPending = async function(){

    const popup = document.getElementById("pendingPopup");
    const list = document.getElementById("pendingList");

    if(!popup || !list) return;

    popup.style.display = "flex";
    list.innerHTML = "Loading...";

    const snap = await getDocs(collection(db, "transactions"));

    list.innerHTML = "";

    let found = false;

    snap.forEach(docSnap => {

        const d = docSnap.data();

        if(d.status === "pending"){
            found = true;

            const item = document.createElement("div");
            item.className = "card";

            item.innerHTML = `
                <p>₹${d.amount} (${d.type})</p>
                <p>User: ${d.userId}</p>
                <p>Status: ${d.status}</p>
            `;

            list.appendChild(item);
        }
    });

    if(!found){
        list.innerHTML = "No pending requests";
    }
};


// =============================
// ❌ CLOSE POPUP
// =============================
window.closePendingAdmin = function(){
    const popup = document.getElementById("pendingPopup");
    if(popup){
        popup.style.display = "none";
    }
};
