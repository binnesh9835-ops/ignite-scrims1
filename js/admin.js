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
    updateDoc,
    getDoc,
    increment
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
    await loadAdminHistory();
}


// =============================
// 🎮 CREATE MATCH
// =============================
window.createMatch = async function () {
    const type = document.getElementById("type").value;
    const mode = document.getElementById("mode").value;
    const entry = Number(document.getElementById("entry").value);
    const perKill = Number(document.getElementById("perKill").value);
    const booyah = Number(document.getElementById("booyah").value);
    const slots = Number(document.getElementById("slots").value);
    const time = document.getElementById("time").value;
    
    
    // ❌ validation
    if(!entry || !perKill || !booyah || !slots || !time){
        alert("Fill all fields ❌");
        return;
    }

    try {

        await addDoc(collection(db, "matches"), {
            type,
            mode,
            entry,
            perKill,
            booyah,
            totalSlots: slots,
            joined: 0,              // 🔥 IMPORTANT
            time,
            status: "open",         // 🔥 AUTO SYSTEM BASE
            createdAt: new Date()
        });

        alert("Match Created ✅");

        // 🔄 reset form
        document.getElementById("entry").value = "";
        document.getElementById("perKill").value = "";
        document.getElementById("booyah").value = "";
        document.getElementById("slots").value = "";
        document.getElementById("time").value = "";

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

    for (const docSnap of snap.docs) {

        const d = docSnap.data();

        if(d.status === "pending"){

            found = true;

            // 🔥 USER NAME FETCH
            let userName = "Unknown";

            try{
                const userRef = doc(db, "users", d.userId);
                const userSnap = await getDoc(userRef);

                if(userSnap.exists()){
                    const u = userSnap.data();
                    userName = u.name || u.email || "User";
                }
            }catch(err){}

            const item = document.createElement("div");
            item.className = "card";

            item.innerHTML = `
                <p><b>${userName}</b></p>
                <p>₹${d.amount} (${d.type})</p>
                <p>UTR: ${d.utr || "N/A"}</p>

                <div style="margin-top:10px;">
                    <button style="background:green;color:white;padding:8px;border:none;border-radius:6px;"
                        onclick="approveTx('${docSnap.id}')">
                        Approve
                    </button>

                    <button style="background:red;color:white;padding:8px;border:none;border-radius:6px;margin-left:5px;"
                        onclick="rejectTx('${docSnap.id}')">
                        Reject
                    </button>
                </div>
            `;

            list.appendChild(item);
        }
    }

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


// =============================
// 🟢 APPROVE (REAL MONEY LOGIC)
// =============================
window.approveTx = async function(txId){

    try{

        const txRef = doc(db, "transactions", txId);
        const txSnap = await getDoc(txRef);

        if(!txSnap.exists()){
            alert("Transaction not found");
            return;
        }

        const tx = txSnap.data();

        if(tx.status !== "pending"){
            alert("Already processed");
            return;
        }

        const userRef = doc(db, "users", tx.userId);

        // 🔥 ADD MONEY
        if(tx.type === "add"){
            await updateDoc(userRef, {
                balance: increment(tx.amount)
            });
        }

        // 🔥 WITHDRAW
        if(tx.type === "withdraw"){
            await updateDoc(userRef, {
                winningBalance: increment(-tx.amount),
                totalWithdraw: increment(tx.amount)
            });
        }

        // ✅ STATUS UPDATE
        await updateDoc(txRef, {
            status: "approved"
        });

        // 📝 SAVE LOG (FIXED POSITION)
        await addDoc(collection(db, "adminLogs"), {
            userId: tx.userId,
            amount: tx.amount,
            type: tx.type,
            action: "approved",
            adminEmail: currentUser.email,
            createdAt: new Date()
        });

        alert("Approved ✅");

        openPending();
        loadAdminStats();

    }catch(err){
        alert(err.message);
    }
};
    
// =============================
// 🔴 REJECT
// =============================
    window.rejectTx = async function(txId){

    try{

        const ref = doc(db, "transactions", txId);

        const txSnap = await getDoc(ref);
        const tx = txSnap.data();

        // ❌ STATUS UPDATE
        await updateDoc(ref, {
            status: "rejected"
        });

        // 📝 SAVE LOG
        await addDoc(collection(db, "adminLogs"), {
            userId: tx.userId,
            amount: tx.amount,
            type: tx.type,
            action: "rejected",
            adminEmail: currentUser.email,
            createdAt: new Date()
        });

        alert("Rejected ❌");

        openPending();
        loadAdminStats();

    }catch(err){
        alert(err.message);
    }
};

// =============================
// 📝 LOAD ADMIN HISTORY
// =============================
async function loadAdminHistory(){

    const list = document.getElementById("adminHistory");
    if(!list) return;

    list.innerHTML = "Loading...";

    const snap = await getDocs(collection(db, "adminLogs"));

    list.innerHTML = "";

    if(snap.empty){
        list.innerHTML = "No history yet";
        return;
    }

    snap.forEach(docSnap => {

        const d = docSnap.data();

        const item = document.createElement("div");
        item.className = "card";

        item.innerHTML = `
            <p><b>${d.adminEmail}</b></p>
            <p>${d.type.toUpperCase()} ₹${d.amount}</p>
            <p style="color:${d.action === "approved" ? "lime" : "red"};">
                ${d.action.toUpperCase()}
            </p>
        `;

        list.appendChild(item);
    });
}
