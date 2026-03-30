// 🔥 IMPORTS
import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc,
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentUser = null;


// 🧠 TOURNAMENT DATA (DEMO)
let tournamentData = {
    id: "t1",
    mode: "squad",
    entry: 200,
    totalMatches: 6,
    perKillPoint: 2
};


// 🔐 CHECK USER
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    loadTournament();
    loadLeaderboard();
});


// 🏆 LOAD TOURNAMENT INFO
function loadTournament() {

    document.getElementById("mode").innerText = tournamentData.mode;
    document.getElementById("entry").innerText = tournamentData.entry;
    document.getElementById("matches").innerText = tournamentData.totalMatches;
    document.getElementById("perKill").innerText = tournamentData.perKillPoint;

    document.getElementById("joinEntry").innerText = tournamentData.entry;
}


// 🔘 OPEN POPUP
window.openJoinPopup = () => togglePopup("joinPopup", true);

window.closePopup = () => {
    document.querySelectorAll(".popup").forEach(p => p.classList.add("hidden"));
};

function togglePopup(id, show) {
    document.getElementById(id).classList.toggle("hidden", !show);
}


// 🎯 JOIN TOURNAMENT
window.confirmJoin = async function () {

    const teamName = document.getElementById("teamInput").value.trim();

    if (!teamName) {
        alert("Enter team name!");
        return;
    }

    try {

        // 🧾 USER DATA
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        if (userData.balance < tournamentData.entry) {
            alert("Insufficient balance!");
            return;
        }

        // 🔢 GET CURRENT TEAMS
        const teamsRef = collection(db, "tournaments", tournamentData.id, "teams");
        const snap = await getDocs(teamsRef);

        const slot = snap.size + 1;

        // 💾 SAVE TEAM
        await addDoc(teamsRef, {
            userId: currentUser.uid,
            teamName,
            slot,
            totalKills: 0,
            totalPoints: 0,
            wins: 0,
            matches: []
        });

        // 💸 DEDUCT BALANCE
        await updateDoc(userRef, {
            balance: userData.balance - tournamentData.entry
        });

        closePopup();
        togglePopup("successPopup", true);

        document.getElementById("slotNumber").innerText = slot;

        loadLeaderboard();

    } catch (err) {
        alert(err.message);
    }
};


// 📊 LOAD LEADERBOARD
async function loadLeaderboard() {

    const list = document.getElementById("leaderboardList");
    list.innerHTML = "";

    const teamsRef = collection(db, "tournaments", tournamentData.id, "teams");
    const snap = await getDocs(teamsRef);

    let teams = [];

    snap.forEach(doc => {
        teams.push(doc.data());
    });

    // 🔥 SORT BY POINTS
    teams.sort((a, b) => b.totalPoints - a.totalPoints);

    teams.forEach((t, index) => {

        const row = `
        <div class="leader-row">
            <span>${index + 1}</span>
            <span>${t.teamName}</span>
            <span>${t.totalKills}</span>
            <span>${t.totalPoints}</span>
            <span>${t.wins}</span>
        </div>
        `;

        list.innerHTML += row;
    });
}
