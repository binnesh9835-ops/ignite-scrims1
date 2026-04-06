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
    increment
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


// 🎯 JOIN MATCH
window.confirmJoin = async function(){

    const teamName = document.getElementById("teamInput").value.trim();

    if (!teamName) {
        alert("Enter team name");
        return;
    }

    try{

        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        const user = userSnap.data();

        if(user.balance < matchData.entry){
            alert("Not enough balance");
            return;
        }

        const playersRef = collection(db, "matches", matchId, "players");
        const snap = await getDocs(playersRef);

        if(snap.size >= matchData.totalSlots){
            alert("Match full");
            return;
        }

        const slot = snap.size + 1;

        // ✅ SAVE PLAYER
        await addDoc(playersRef, {
            userId: currentUser.uid,
            teamName,
            slot,
            kills: 0,
            createdAt: new Date()
        });

        // 💸 DEDUCT MONEY
        await updateDoc(userRef, {
            balance: increment(-matchData.entry)
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
