document.addEventListener("DOMContentLoaded", ()=>{

  window.openAddMoney = function(){
    document.getElementById("addMoneyPopup").style.display = "flex";
  }

  window.confirmAmount = function(){

    let amount = document.getElementById("amountInput").value;

    if(!amount || isNaN(amount)){
      alert("Enter valid amount");
      return;
    }

    document.getElementById("payAmount").innerText =
      "Send ₹" + amount + " to above UPI";

    document.getElementById("addMoneyPopup").style.display = "none";
    document.getElementById("paymentPopup").style.display = "flex";
  }

  window.submitPayment = async function(){

    let user = firebase.auth().currentUser;
    if(!user){
      alert("Login first");
      return;
    }

    let amount = Number(document.getElementById("amountInput").value);
    let name = document.getElementById("payerName").value;
    let txnId = document.getElementById("txnId").value;

    if(!name || !txnId){
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

    document.getElementById("paymentPopup").style.display = "none";

    loadTransactions(transactions);
  }

  window.loadTransactions = function(list){

    let box = document.getElementById("transactionsBox");

    if(!list || list.length === 0){
      box.innerHTML = "<p>No transactions yet</p>";
      return;
    }

    box.innerHTML = "";

    list.forEach(t=>{

      let color = "white";
      let sign = "+";

      if(t.status === "pending") color = "yellow";
      else if(t.status === "rejected") color = "red";
      else if(t.status === "success") color = "green";

      if(t.type === "debit") sign = "-";

      box.innerHTML += 
        <p style="color:${color}">
          ${sign} ₹${t.amount} (${t.status})
        </p>
      ;
    });

  }

});
