console.log("PRO wallet loaded");

// 🔥 IMPORTS
import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    doc,
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    getDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentUser = null;


// =============================
// 🔐 AUTH + REALTIME USER DATA
// =============================
onAuthStateChanged(auth, (user) => {

    if (!user) return;

    currentUser = user;

    const userRef = doc(db, "users", user.uid);

    onSnapshot(userRef, (snap) => {

        if (snap.exists()) {

            const data = snap.data();

            const deposit = data.balance || 0;
            const winning = data.winningBalance || 0;
            const total = deposit + winning;

            const dEl = document.getElementById("deposit");
const wEl = document.getElementById("winning");
const bEl = document.getElementById("balance");

if(dEl) dEl.innerText = deposit;
if(wEl) wEl.innerText = winning;
if(bEl) bEl.innerText = total;
        }
    });

    loadHistory();
});


// =============================
// 💰 POPUPS
// =============================
window.openAddMoney = function(){
    document.getElementById("addMoneyPopup").classList.add("show");
}
window.openWithdraw = function(){
    document.getElementById("withdrawPopup").classList.add("show");
}


window.closePopup = () => {
    document.querySelectorAll(".popup").forEach(p => p.classList.remove("show"));
};

function show(id){
    document.getElementById(id)?.classList.add("show");
}
function hide(id){
    document.getElementById(id)?.classList.remove("show");
}


// =============================
// ➡️ ADD MONEY STEP
// =============================
window.nextAddStep = function () {

    const amount = Number(document.getElementById("amount").value);

    if (!amount || amount < 10) {
        return toast("Minimum ₹10 required ❌");
    }

    hide("addMoneyPopup");
    show("paymentPopup");
};


// =============================
// 📤 ADD MONEY REQUEST
// =============================
window.submitPayment = async function () {

    const amount = Number(document.getElementById("amount").value);
    const utr = document.getElementById("utr").value.trim();
    const sender = document.getElementById("sender").value.trim();

    if (!utr || !sender) {
        return toast("Fill all fields ❌");
    }

    // 🔒 DUPLICATE UTR CHECK
    const snap = await getDocs(collection(db, "transactions"));
    let duplicate = false;

    snap.forEach(d => {
        if(d.data().utr === utr){
            duplicate = true;
        }
    });

    if(duplicate){
        return toast("UTR already used ❌");
    }

    await addDoc(collection(db, "transactions"), {
        userId: currentUser.uid,
        type: "add",
        amount,
        utr,
        sender,
        status: "pending",
        createdAt: new Date()
    });

    closePopup();
    show("pendingPopup");
};


// =============================
// 💸 WITHDRAW
// =============================
window.submitWithdraw = async function () {

    const amount = Number(document.getElementById("withdrawAmount").value);

    if (!amount || amount < 100) {
        return toast("Minimum ₹100 ❌");
    }

    const userRef = doc(db, "users", currentUser.uid);
    const snap = await getDoc(userRef);
    const data = snap.data();

    if (amount > (data.winningBalance || 0)) {
        return toast("Only winning balance allowed ❌");
    }

    await addDoc(collection(db, "transactions"), {
        userId: currentUser.uid,
        type: "withdraw",
        amount,
        status: "pending",
        createdAt: new Date()
    });

    closePopup();
    toast("Withdraw request sent ✅");
};


// =============================
// 📜 REALTIME HISTORY
// =============================
function loadHistory(){

    const list = document.getElementById("historyList");

    const q = query(
        collection(db, "transactions"),
        orderBy("createdAt", "desc")
    );

    onSnapshot(q, (snapshot) => {

        list.innerHTML = "";

        snapshot.forEach(docSnap => {

            const d = docSnap.data();
            if (d.userId !== currentUser.uid) return;

            const color =
                d.status === "approved" ? "lime" :
                d.status === "pending" ? "orange" : "red";

            const date = d.createdAt?.toDate?.().toLocaleString() || "";

            list.innerHTML += `
            <div class="card">
                <b>₹${d.amount}</b> (${d.type.toUpperCase()})  
                <span style="color:${color}">${d.status}</span><br>
                <small>${date}</small><br>
                ${d.utr ? `<small>UTR: ${d.utr}</small>` : ""}
            </div>`;
        });

        if(list.innerHTML === ""){
            list.innerHTML = "No transactions yet";
        }
    });
}


// =============================
// 🔔 TOAST
// =============================
function toast(msg){

    const t = document.createElement("div");
    t.className = "toast";
    t.innerText = msg;

    document.body.appendChild(t);

    setTimeout(()=> t.remove(), 2500);
}


// =============================
// ❌ CLOSE PENDING
// =============================
window.closePending = function(){
    hide("pendingPopup");
};


// =============================
// 📷 QR POPUP
// =============================
window.showQR = function(){
    document.getElementById("qrPopup").classList.add("show");
}

window.closeQR = function(){
    document.getElementById("qrPopup")?.classList.remove("show");
};

window.backToAdd = function(){
    document.getElementById("paymentPopup")?.classList.remove("show");
    document.getElementById("addMoneyPopup")?.classList.add("show");
};

window.backToWallet = function(){
    document.querySelectorAll(".popup").forEach(p => p.classList.remove("show"));
};
