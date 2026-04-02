console.log("wallet loaded");

// 🔥 IMPORTS
import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    addDoc,
    query,
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentUser = null;


// 🔐 LOAD USER DATA
onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    currentUser = user;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
        const data = snap.data();

        document.getElementById("balance").innerText = data.balance || 0;
        document.getElementById("totalWinning").innerText = data.totalWinning || 0;
        document.getElementById("totalSpent").innerText = data.totalSpent || 0;
        document.getElementById("totalWithdraw").innerText = data.totalWithdraw || 0;
    }

    loadHistory();
});


// 💰 POPUPS (GLOBAL)
window.openAddMoney = () => showPopup("addMoneyPopup");
window.openWithdraw = () => showPopup("withdrawPopup");

window.closePopup = () => {
    document.querySelectorAll(".popup").forEach(p => p.classList.remove("show"));
};

window.backToAdd = () => {
    hidePopup("paymentPopup");
    showPopup("addMoneyPopup");
};


// ✅ SHOW / HIDE (FINAL FIX)
function showPopup(id){
    const el = document.getElementById(id);
    if(el){
        el.classList.add("show");   // ✅ SHOW CLASS
    }
}

function hidePopup(id){
    const el = document.getElementById(id);
    if(el){
        el.classList.remove("show"); // ✅ REMOVE SHOW
    }
}


// ➡️ NEXT STEP (ADD MONEY)
window.nextAddStep = function () {

    const amount = Number(document.getElementById("amount").value);

    if (!amount || amount <= 0) {
        alert("Enter valid amount");
        return;
    }

    hidePopup("addMoneyPopup");
    showPopup("paymentPopup");
};


// 📤 SUBMIT PAYMENT (ADD MONEY REQUEST)
window.submitPayment = async function () {

    const amount = Number(document.getElementById("amount").value);
    const utr = document.getElementById("utr").value.trim();
    const sender = document.getElementById("sender").value.trim();

    if (!utr || !sender) {
        alert("All fields required!");
        return;
    }

    try {
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
        showPopup("pendingPopup");

        loadHistory();

    } catch (err) {
        alert(err.message);
    }
};


// 💸 WITHDRAW
window.submitWithdraw = async function () {

    const amount = Number(document.getElementById("withdrawAmount").value);

    if (!amount || amount < 100) {
        alert("Minimum ₹100");
        return;
    }

    try {
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);
        const data = snap.data();

        if (amount > (data.winningBalance || 0)) {
            alert("Only winning balance allowed");
            return;
        }

        await addDoc(collection(db, "transactions"), {
            userId: currentUser.uid,
            type: "withdraw",
            amount,
            status: "pending",
            createdAt: new Date()
        });

        closePopup();
        alert("Withdraw request sent ✅");

        loadHistory();

    } catch (err) {
        alert(err.message);
    }
};


// 📜 HISTORY
async function loadHistory() {

    const list = document.getElementById("historyList");
    if(!list) return;

    list.innerHTML = "Loading...";

    const q = query(
        collection(db, "transactions"),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    list.innerHTML = "";

    snapshot.forEach(docSnap => {

        const d = docSnap.data();
        if (d.userId !== currentUser.uid) return;

        const color =
            d.status === "approved" ? "green" :
            d.status === "pending" ? "orange" : "red";

        const item = `
        <div class="card">
            ₹${d.amount} (${d.type}) - 
            <span style="color:${color}">${d.status}</span>
        </div>
        `;

        list.innerHTML += item;
    });

    if(list.innerHTML === ""){
        list.innerHTML = "No transactions yet";
    }
}


// ✅ CLOSE PENDING POPUP
window.closePending = function(){

    hidePopup("pendingPopup");

    // reset form
    const amount = document.getElementById("amount");
    const utr = document.getElementById("utr");
    const sender = document.getElementById("sender");

    if(amount) amount.value = "";
    if(utr) utr.value = "";
    if(sender) sender.value = "";
};
