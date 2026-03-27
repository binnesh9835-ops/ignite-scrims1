document.addEventListener("DOMContentLoaded", () => {

  /* ================= ADD MONEY ================= */
  window.confirmAmount = function () {

    let amount = document.getElementById("amountInput").value;

    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    document.getElementById("payAmount").innerText =
      "Send ₹" + amount + " to 9279072936@axl";

    closePopup("addMoneyPopup");
    openPopup("paymentPopup");
  }

  /* ================= SUBMIT PAYMENT ================= */
  window.submitPayment = async function () {

    let user = firebase.auth().currentUser;
    if (!user) return alert("Login first");

    let amount = Number(document.getElementById("amountInput").value);
    let name = document.getElementById("payerName").value;
    let txnId = document.getElementById("txnId").value;

    if (!name || !txnId) {
      alert("Fill all fields");
      return;
    }

    let db = firebase.firestore();
    let ref = db.collection("users").doc(user.email);

    let doc = await ref.get();
    let data = doc.data();

    let transactions = data.transactions || [];

    transactions.unshift({
      type: "deposit",
      amount: amount,
      status: "pending",
      name: name,
      txnId: txnId,
      time: Date.now()
    });

    await ref.update({ transactions });

    closePopup("paymentPopup");
    openPopup("successPopup");

    loadWallet();
  }

  /* ================= WITHDRAW ================= */
  window.submitWithdraw = async function () {

    let user = firebase.auth().currentUser;
    if (!user) return alert("Login first");

    let amount = Number(document.getElementById("withdrawAmount").value);
    let upi = document.getElementById("withdrawUpi").value;
    let msg = document.getElementById("withdrawMsg");

    msg.innerText = "";

    if (!amount || isNaN(amount) || amount <= 0) {
      msg.style.color = "red";
      msg.innerText = "Enter valid amount";
      return;
    }

    if (amount < 100) {
      msg.style.color = "red";
      msg.innerText = "Minimum withdrawal is ₹100";
      return;
    }

    if (amount > 1000) {
      msg.style.color = "red";
      msg.innerText = "Maximum withdrawal is ₹1000";
      return;
    }

    if (!upi) {
      msg.style.color = "red";
      msg.innerText = "Enter UPI ID";
      return;
    }

    let db = firebase.firestore();
    let ref = db.collection("users").doc(user.email);

    let doc = await ref.get();
    let data = doc.data();

    let winning = data.winning || 0;

    if (amount > winning) {
      msg.style.color = "red";
      msg.innerText =` You can withdraw only ₹${winning}`;
      return;
    }

    let transactions = data.transactions || [];

    transactions.unshift({
      type: "withdraw",
      amount: amount,
      status: "pending",
      upi: upi,
      label: "withdrawal",
      time: Date.now()
    });

    await ref.update({
      transactions,
      winning: winning - amount
    });

    closePopup("withdrawPopup");
    openPopup("successPopup");

    loadWallet();
  }

  /* ================= LOAD WALLET ================= */
  window.loadWallet = async function () {

    let user = firebase.auth().currentUser;
    if (!user) return;

    let db = firebase.firestore();
    let ref = db.collection("users").doc(user.email);

    let doc = await ref.get();
    let data = doc.data();

    /* BALANCES */
    document.getElementById("balance").innerText =
      "₹" + (data.deposit || 0);

    document.getElementById("winningBalance").innerText =
      "₹" + (data.winning || 0);

    /* TRANSACTIONS */
    loadTransactions(data.transactions || []);
  }

  /* ================= TRANSACTION UI ================= */
  window.loadTransactions = function (list) {

    let box = document.getElementById("history");

    if (!list || list.length === 0) {
      box.innerHTML = "<p>No transactions yet</p>";
      return;
    }

    box.innerHTML = "";

    list.forEach(t => {

      let color = "white";
      let text = "";
      if (t.status === "pending") color = "yellow";
      if (t.status === "success") color = "limegreen";
      if (t.status === "rejected") color = "red";

      if (t.type === "deposit") {
        text = + ₹${t.amount} Added;
      }

      if (t.type === "winning") {
        text = + ₹${t.amount} Won;
      }

      if (t.type === "withdraw") {
        text = - ₹${t.amount} Withdraw;
      }

      box.innerHTML += 
        <p style="color:${color}">
          ${text} <br>
          <small style="opacity:0.6;">${t.status}</small>
        </p>
      ;
    });
  }

});
