document.addEventListener("DOMContentLoaded", () => {

  /* ADD MONEY */
  window.confirmAmount = function () {

    let amount = document.getElementById("amountInput").value;

    if (!amount  isNaN(amount)  amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    document.getElementById("payAmount").innerText =
      "Send ₹" + amount;

    closePopup("addMoneyPopup");
    openPopup("paymentPopup");
  }

  /* PAYMENT */
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
      amount,
      type: "credit",
      status: "pending",
      name,
      txnId,
      time: Date.now()
    });

    await ref.update({ transactions });

    alert("Request submitted ✅");

    closePopup("paymentPopup");
  }

  /* WITHDRAW */
  window.submitWithdraw = async function () {

    let user = firebase.auth().currentUser;
    if (!user) return alert("Login first");

    let amount = Number(document.getElementById("withdrawAmount").value);
    let upi = document.getElementById("withdrawUpi").value;
    let msg = document.getElementById("withdrawMsg");

    msg.innerText = "";

    if (!amount  isNaN(amount)  amount <= 0) {
      msg.style.color = "red";
      msg.innerText = "Enter valid amount";
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
      msg.innerText = You can withdraw only ₹${winning};
      return;
    }

    let transactions = data.transactions || [];

    transactions.unshift({
      type: "debit",
      amount,
      status: "pending",
      upi,
      label: "withdrawal",
      time: Date.now()
    });

    await ref.update({
      transactions,
      winning: winning - amount
    });

    closePopup("withdrawPopup");
    openPopup("successPopup");
  }

});
