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

        if(document.getElementById("balance"))
            document.getElementById("balance").innerText = data.balance || 0;

        if(document.getElementById("totalWinning"))
            document.getElementById("totalWinning").innerText = data.totalWinning || 0;

        if(document.getElementById("totalSpent"))
            document.getElementById("totalSpent").innerText = data.totalSpent || 0;

        if(document.getElementById("totalWithdraw"))
            document.getElementById("totalWithdraw").innerText = data.totalWithdraw || 0;
    }

    loadHistory();
});


// 💰 POPUPS (GLOBAL)
window.openAddMoney = () => showPopup("addMoneyPopup");
window.openWithdraw = () => showPopup("withdrawPopup");

window.closePopup = () => {
    document.querySelectorAll(".popup").forEach(p => p.classList.add("hidden"));
};

window.backToAdd = () => {
    hidePopup("paymentPopup");
    showPopup("addMoneyPopup");
};


// ✅ SHOW / HIDE (FIXED)
function showPopup(id){
    const el = document.getElementById(id);
    if(el){
        el.classList.remove("hidden");
    }
}

function hidePopup(id){
    const el = document.getElementById(id);
    if(el){
        el.classList.add("hidden");
    }
}


// ➡️ NEXT STEP
window.nextAddStep = function () {

    const amount = Number(document.getElementById("amount").value);

    if (!amount || amount <= 0) {
        alert("Enter valid amount");
        return;
    }

    hidePopup("addMoneyPopup");
    showPopup("paymentPopup");
};


// 📤 SUBMIT PAYMENT
window.submitPayment = async function () {

    const amount = Number(document.getElementById("amount").value);
    const utr = document.getElementById("utr").value.trim();
    const sender = document.getElementById("sender").value.trim();

    if (!utr || !sender) {
        alert("All fields required!");
        return;
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
    showPopup("pendingPopup");

    loadHistory();
};


// 💸 WITHDRAW
window.submitWithdraw = async function () {

    const amount = Number(document.getElementById("withdrawAmount").value);

    if (!amount || amount < 100) {
        alert("Minimum ₹100");
        return;
    }

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
    alert("Withdraw request sent");

    loadHistory();
};


// 📜 HISTORY
async function loadHistory() {

    const list = document.getElementById("txList");
    if(!list) return;

    list.innerHTML = "Loading...";

    const q = query(collection(db, "transactions"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    list.innerHTML = "";

    snapshot.forEach(docSnap => {

        const d = docSnap.data();
        if (d.userId !== currentUser.uid) return;

        const item = `
        <div class="card">
            ₹${d.amount} (${d.type}) - ${d.status}
        </div>
        `;

        list.innerHTML += item;
    });

    if(list.innerHTML === ""){
        list.innerHTML = "No transactions yet";
    }
}


// ✅ CLOSE PENDING POPUP (FINAL)
window.closePending = function(){
    const el = document.getElementById("pendingPopup");
    if(el){
        el.classList.add("hidden");
    }

    // reset form
    const amount = document.getElementById("amount");
    const utr = document.getElementById("utr");
    const sender = document.getElementById("sender");

    if(amount) amount.value = "";
    if(utr) utr.value = "";
    if(sender) sender.value = "";
};
