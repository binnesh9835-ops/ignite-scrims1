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

        // 🔥 SAFE SET
        if(document.getElementById("balance"))
            document.getElementById("balance").innerText = data.balance || 0;

        if(document.getElementById("winning"))
            document.getElementById("winning").innerText = data.winningBalance || 0;

        if(document.getElementById("totalWinning"))
            document.getElementById("totalWinning").innerText = data.totalWinning || 0;

        if(document.getElementById("totalSpent"))
            document.getElementById("totalSpent").innerText = data.totalSpent || 0;

        if(document.getElementById("totalWithdraw"))
            document.getElementById("totalWithdraw").innerText = data.totalWithdraw || 0;
    }

    loadHistory();
});


// 💰 POPUPS
window.openAddMoney = () => togglePopup("addMoneyPopup", true);
window.openWithdraw = () => togglePopup("withdrawPopup", true);

window.closePopup = () => {
    document.querySelectorAll(".popup").forEach(p => p.classList.add("hidden"));
};

window.backToWallet = () => closePopup();

window.backToAdd = () => {
    togglePopup("paymentPopup", false);
    togglePopup("addMoneyPopup", true);
};


// 🔁 POPUP TOGGLE
function togglePopup(id, show) {
    const el = document.getElementById(id);
    if(!el) return;
    el.classList.toggle("hidden", !show);
}


// ➡️ ADD MONEY STEP 2
window.nextAddStep = function () {

    const amount = Number(document.getElementById("amount").value);

    if (!amount || amount <= 0) {
        alert("Enter valid amount");
        return;
    }

    togglePopup("addMoneyPopup", false);
    togglePopup("paymentPopup", true);
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
        togglePopup("pendingPopup", true);

        loadHistory();

    } catch (err) {
        alert(err.message);
    }
};


// 💸 WITHDRAW REQUEST
window.submitWithdraw = async function () {

    const amount = Number(document.getElementById("withdrawAmount").value);

    if (!amount || amount < 100) {
        alert("Minimum withdraw ₹100");
        return;
    }

    const userRef = doc(db, "users", currentUser.uid);
    const snap = await getDoc(userRef);
    const data = snap.data();

    const winningBalance = data.winningBalance || 0;

    if (amount > winningBalance) {
        alert("Only winning balance withdraw allowed");
        return;
    }

    try {

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


// 📜 LOAD HISTORY (ONLY USER DATA)
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

        // ✅ FILTER USER ONLY
        if (d.userId !== currentUser.uid) return;

        const color =
            d.status === "approved" ? "green" :
            d.status === "pending" ? "orange" : "red";

        const item = `
        <div class="history-item">
            <p>₹${d.amount} (${d.type})</p>
            <span style="color:${color}">${d.status}</span>
        </div>
        `;

        list.innerHTML += item;
    });

    if(list.innerHTML === ""){
        list.innerHTML = "No transactions yet";
    }
}
