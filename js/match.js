import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { runTransaction } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
    doc,
    getDoc,
    updateDoc,
    collection,
    addDoc,
    getDocs,
    increment,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentUser = null;
let matchId = null;
let matchData = null;


// 🔐 GET URL ID
function getMatchId(){
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}


// 🔐 AUTH
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;
    matchId = getMatchId();

    await loadMatch();
    loadScoreboard();
});


// 🎮 LOAD MATCH FROM FIRESTORE
async function loadMatch(){

    const ref = doc(db, "matches", matchId);
    const snap = await getDoc(ref);

    if(!snap.exists()){
        alert("Match not found");
        return;
    }

    matchData = snap.data();

    document.getElementById("mode").innerText = matchData.mode;
    document.getElementById("entry").innerText = matchData.entry;
    document.getElementById("perKill").innerText = matchData.perKill;
    document.getElementById("booyah").innerText = matchData.booyah;
    document.getElementById("slots").innerText = matchData.totalSlots;
    document.getElementById("time").innerText = matchData.time;

    document.getElementById("joinEntry").innerText = matchData.entry;
}

// 🔴 LIVE SLOT LISTENER
const playersRef = collection(db, "matches", matchId, "players");

onSnapshot(playersRef, (snap) => {
    const joined = snap.size;

    document.getElementById("slots").innerText =
        `${joined} / ${matchData.totalSlots}`;

    // 🔒 AUTO FULL LOCK
    if (joined >= matchData.totalSlots) {
        document.getElementById("joinBtn")?.remove();
    }
});

// 🎯 JOIN MATCH
window.confirmJoin = async function(){

    const teamName = document.getElementById("teamInput").value.trim();

    if (!teamName) {
        alert("Enter team name");
        return;
    }

    try{

        const userRef = doc(db, "users", currentUser.uid);

        await runTransaction(db, async (transaction) => {

            const matchRef = doc(db, "matches", matchId);
            const matchSnap = await transaction.get(matchRef);
            const match = matchSnap.data();

            const playersRef = collection(db, "matches", matchId, "players");
            const snap = await getDocs(playersRef);

            if (snap.size >= match.totalSlots) {
                throw new Error("Match full ❌");
            }

            const userDoc = await transaction.get(userRef);
            const userData = userDoc.data();

            if (userData.balance < match.entry) {
                throw new Error("Insufficient balance");
            }

            const slot = snap.size + 1;

            // 💾 SAVE PLAYER
            await addDoc(playersRef, {
                userId: currentUser.uid,
                teamName,
                slot,
                kills: 0,
                createdAt: new Date()
            });

            // 💸 DEDUCT
            transaction.update(userRef, {
                balance: userData.balance - match.entry
            });

            // 🔥 UPDATE MATCH JOIN COUNT
            transaction.update(matchRef, {
                joined: increment(1),
                status: (snap.size + 1 >= match.totalSlots) ? "full" : "open"
            });

        });

        alert("Joined Successfully ✅");

        loadScoreboard();

    }catch(err){
        alert(err.message);
    }
};

// 📊 SCOREBOARD
async function loadScoreboard(){

    const list = document.getElementById("scoreList");
    list.innerHTML = "";

    const playersRef = collection(db, "matches", matchId, "players");
    const snap = await getDocs(playersRef);

    snap.forEach(docSnap => {

        const p = docSnap.data();

        list.innerHTML += `
        <div class="score-row">
            <p>Slot ${p.slot} - ${p.teamName}</p>
            <p>Kills: ${p.kills}</p>
        </div>
        `;
    });
}
