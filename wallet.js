document.addEventListener("DOMContentLoaded", () => {

  /* ================= OPEN ADD MONEY ================= */
  window.openAddMoney = function () {
    document.getElementById("addMoneyPopup").style.display = "flex";
  }

  /* ================= CONFIRM AMOUNT ================= */
  window.confirmAmount = function () {

    let amount = document.getElementById("amountInput").value;

    // FIXED CONDITION
    if (!amount  isNaN(amount)  amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    document.getElementById("payAmount").innerText =
      "Send ₹" + amount + " to above UPI";

    document.getElementById("addMoneyPopup").style.display = "none";
    document.getElementById("paymentPopup").style.display = "flex";
  }

  /* ================= SUBMIT PAYMENT ================= */
  window.submitPayment = async function () {

    let user = firebase.auth().currentUser;
    if (!user) {
      alert("Login first");
      return;
    }

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
      amount: amount,
      type: "credit",
      status: "pending",
      name: name,
      txnId: txnId,
      time: Date.now()
    });

    await ref.update({ transactions });

    alert("Request submitted ✅");

    document.getElementById("paymentPopup").style.display = "none";

    loadTransactions(transactions);
  }

  /* ================= WITHDRAW (UPI ADDED) ================= */
  window.submitWithdraw = async function () {

    let user = firebase.auth().currentUser;
    if (!user) {
      alert("Login first");
      return;
    }

    let amount = document.getElementById("withdrawAmount").value;
    let upi = document.getElementById("withdrawUpi").value;

    // VALIDATION
    if (!amount  isNaN(amount)  amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    if (!upi) {
      alert("Enter your UPI ID");
      return;
    }

    let db = firebase.firestore();
    let ref = db.collection("users").doc(user.email);

    let doc = await ref.get();
    let data = doc.data();

    let transactions = data.transactions || [];

    transactions.unshift({
      amount: amount,
      type: "debit",
      status: "pending",
      upi: upi,   // ✅ UPI SAVED HERE
      time: Date.now()
    });

    await ref.update({ transactions });

    alert("Withdraw request submitted");

    document.getElementById("withdrawPopup").style.display = "none";

    loadTransactions(transactions);
  }

  /* ================= LOAD TRANSACTIONS ================= */
  window.loadTransactions = function (list) {

    let box = document.getElementById("transactionsBox");

    if (!list || list.length === 0) {
      box.innerHTML = "<p>No transactions yet</p>";
      return;
    }

    box.innerHTML = "";

    list.forEach(t => {

      let color = "white";
      let sign = "+";

      if (t.status === "pending") color = "yellow";
      else if (t.status === "rejected") color = "red";
      else if (t.status === "success") color = "green";

      if (t.type === "debit") sign = "-";

      box.innerHTML += 
        <p style="color:${color}">
          ${sign} ₹${t.amount} (${t.status})
        </p>
      ;
    });

  }

});
