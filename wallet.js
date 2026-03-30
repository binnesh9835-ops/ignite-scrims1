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

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
        const data = snap.data();

        document.getElementById("balance").innerText = data.balance || 0;
        document.getElementById("winning").innerText = data.winningBalance || 0;
    }

    loadHistory();

});


// 💰 OPEN POPUPS
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
    document.getElementById(id).classList.toggle("hidden", !show);
}


// ➡️ ADD MONEY STEP 2
window.nextAddStep = function () {

    const amount = document.getElementById("amount").value;

    if (!amount || amount <= 0) {
        alert("Enter valid amount");
        return;
    }

    togglePopup("addMoneyPopup", false);
    togglePopup("paymentPopup", true);
};


// 📤 SUBMIT PAYMENT
window.submitPayment = async function () {

    const amount = document.getElementById("amount").value;
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
            amount: Number(amount),
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


// 💸 WITHDRAW
window.submitWithdraw = async function () {

    const amount = Number(document.getElementById("withdrawAmount").value);

    if (amount < 100 || amount > 1000) {
        alert("Withdraw limit ₹100 - ₹1000");
        return;
    }

    const userRef = doc(db, "users", currentUser.uid);
    const snap = await getDoc(userRef);
    const data = snap.data();

    if (amount > data.winningBalance) {
        alert("Insufficient winning balance");
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
        alert("Withdraw request submitted");

        loadHistory();

    } catch (err) {
        alert(err.message);
    }
};


// 📜 LOAD HISTORY
async function loadHistory() {

    const list = document.getElementById("historyList");
    list.innerHTML = "";

    const q = query(
        collection(db, "transactions"),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    snapshot.forEach(doc => {

        const d = doc.data();

        if (d.userId !== currentUser.uid) return;

        const item = `
        <div class="history-item">
            <p>₹${d.amount} (${d.type})</p>
            <span class="${d.status}">${d.status}</span>
        </div>
        `;

        list.innerHTML += item;
    });
}
