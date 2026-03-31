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
    getDocs,
    query
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentUser = null;

// 🧠 CURRENT MATCH (TEMP DEMO DATA)
let matchData = {
    id: "match1",
    mode: "squad",
    entry: 50,
    perKill: 10,
    booyah: 100,
    totalSlots: 12,
    time: "Tonight 9:00 PM"
};


// 🔐 CHECK USER
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    loadMatch();
    loadScoreboard();
});


// 🎮 LOAD MATCH DATA
function loadMatch() {

    document.getElementById("mode").innerText = matchData.mode;
    document.getElementById("entry").innerText = matchData.entry;
    document.getElementById("perKill").innerText = matchData.perKill;
    document.getElementById("booyah").innerText = matchData.booyah;
    document.getElementById("slots").innerText = matchData.totalSlots;
    document.getElementById("time").innerText = matchData.time;

    document.getElementById("joinEntry").innerText = matchData.entry;
}


// 🔘 OPEN JOIN POPUP
window.openJoinPopup = function () {
    togglePopup("joinPopup", true);
};

// ❌ CLOSE POPUP
window.closePopup = function () {
    document.querySelectorAll(".popup").forEach(p => p.classList.add("hidden"));
};


// 🔁 POPUP TOGGLE
function togglePopup(id, show) {
    document.getElementById(id).classList.toggle("hidden", !show);
}


// 🎯 CONFIRM JOIN
window.confirmJoin = async function () {

    const teamName = document.getElementById("teamInput").value.trim();

    if (!teamName) {
        alert("Enter name / team!");
        return;
    }

    try {

        // 🧾 GET USER DATA
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        // 💰 CHECK BALANCE
        if (userData.balance < matchData.entry) {
            alert("Insufficient balance!");
            return;
        }

        // 🔢 GET CURRENT PLAYERS
        const playersRef = collection(db, "matches", matchData.id, "players");
        const snap = await getDocs(playersRef);

        const currentCount = snap.size;

        if (currentCount >= matchData.totalSlots) {
            alert("Match full!");
            return;
        }

        const slotNumber = currentCount + 1;

        // 💾 SAVE PLAYER
        await addDoc(playersRef, {
            userId: currentUser.uid,
            teamName: teamName,
            slot: slotNumber,
            kills: 0,
            booyah: false,
            createdAt: new Date()
        });

        // 💸 DEDUCT BALANCE
        await updateDoc(userRef, {
            balance: userData.balance - matchData.entry
        });

        // 🎉 SHOW SUCCESS
        closePopup();
        togglePopup("successPopup", true);

        document.getElementById("slotNumber").innerText = slotNumber;
        document.getElementById("matchTime").innerText = matchData.time;

        loadScoreboard();

    } catch (err) {
        alert(err.message);
    }
};


// 📊 LOAD SCOREBOARD
async function loadScoreboard() {

    const list = document.getElementById("scoreList");
    list.innerHTML = "";

    const playersRef = collection(db, "matches", matchData.id, "players");
    const snap = await getDocs(playersRef);

    snap.forEach(doc => {

        const p = doc.data();

        const row = `
        <div class="score-row">
            <p>Slot ${p.slot} - ${p.teamName}</p>
            <p>Kills: ${p.kills}</p>
        </div>
        `;

        list.innerHTML += row;
    });
}
