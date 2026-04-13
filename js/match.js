import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    getDocs,
    addDoc,
    runTransaction,
    increment,
    query,
    where,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentUser = null;
let matchId = null;
let matchData = null;


// 🔐 GET MATCH ID
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
    setupLiveSlots();
});


// 🎮 LOAD MATCH
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
    document.getElementById("time").innerText = matchData.time;
}


// =============================
// 🔴 LIVE SLOT COUNTER
// =============================
function setupLiveSlots(){

    const playersRef = collection(db, "matches", matchId, "players");

    onSnapshot(playersRef, (snap) => {

        const joined = snap.size;

        document.getElementById("slots").innerText =
            `${joined} / ${matchData.totalSlots}`;

        const btn = document.getElementById("joinBtn");

        if(joined >= matchData.totalSlots){
            if(btn){
                btn.innerText = "Slot Full ❌";
                btn.disabled = true;
            }
        }
    });
}


// =============================
// 🎯 JOIN MATCH
// =============================
window.confirmJoin = async function(){

    const teamName = document.getElementById("teamInput").value.trim();

    if (!teamName) {
        alert("Enter Team Name / IGN");
        return;
    }

    const joinBtn = document.getElementById("joinBtn");

    try{

        joinBtn.innerText = "Checking Balance... 3";

        await wait(1000);
        joinBtn.innerText = "Checking Balance... 2";

        await wait(1000);
        joinBtn.innerText = "Checking Balance... 1";

        await wait(1000);

        const userRef = doc(db, "users", currentUser.uid);

        // 🔍 CHECK ALREADY JOINED
        const q = query(
            collection(db, "matches", matchId, "players"),
            where("userId", "==", currentUser.uid)
        );

        const already = await getDocs(q);

        if(!already.empty){
            alert("You already joined this match ❌");
            joinBtn.disabled = true;
            return;
        }

        await runTransaction(db, async (transaction) => {

            const matchRef = doc(db, "matches", matchId);
            const matchSnap = await transaction.get(matchRef);
            const match = matchSnap.data();

            const userSnap = await transaction.get(userRef);
            const user = userSnap.data();

            if(user.balance < match.entry){
                throw new Error("Insufficient Balance ❌");
            }

            const playersRef = collection(db, "matches", matchId, "players");
            const snap = await getDocs(playersRef);

            let slotStart = snap.size + 1;

            // 🔥 SLOT LOGIC
            let slotsToBook = 1;

            if(match.mode === "Squad") slotsToBook = 4;
            if(match.mode === "Duo") slotsToBook = 2;

            if(snap.size + slotsToBook > match.totalSlots){
                throw new Error("Not enough slots ❌");
            }

            // 💾 ADD PLAYERS
            for(let i=0;i<slotsToBook;i++){
                await addDoc(playersRef, {
                    userId: currentUser.uid,
                    teamName,
                    slot: slotStart + i,
                    kills: 0,
                    createdAt: new Date()
                });
            }

            // 💸 DEDUCT
            transaction.update(userRef, {
                balance: user.balance - match.entry
            });

            // 🔥 UPDATE MATCH
            transaction.update(matchRef, {
                joined: increment(slotsToBook)
            });

        });

        joinBtn.innerText = "Joined ✅";
        joinBtn.disabled = true;

        alert(`Match Joined!

Your Slots: Auto Assigned
Sit on your slots otherwise you may be kicked at checking time.`);

    }catch(err){
        alert(err.message);
        joinBtn.innerText = "Join Match";
    }
};


// ⏳ WAIT
function wait(ms){
    return new Promise(res => setTimeout(res, ms));
}
