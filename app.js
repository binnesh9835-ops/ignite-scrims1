document.addEventListener("DOMContentLoaded", function(){

  console.log("🔥 JS Loaded");

  const tabs = document.querySelectorAll(".tab");
  const sections = document.querySelectorAll(".section");

  tabs.forEach(btn=>{
    btn.addEventListener("click", function(){

      let tabName = btn.dataset.tab;

      if(tabName){
        tabs.forEach(t=>t.classList.remove("active"));
        sections.forEach(s=>s.classList.remove("active"));

        btn.classList.add("active");

        let target = document.getElementById(tabName);
        if(target) target.classList.add("active");
      }

    });
  });

  /* FIREBASE */
  firebase.initializeApp({
    apiKey: "AIzaSyCgyT_wRam-8FWkq5VePffFtymUMbRnXCQ",
    authDomain: "ignite-scrims.firebaseapp.com",
    projectId: "ignite-scrims"
  });

  const auth = firebase.auth();
  const db = firebase.firestore();

  const authBtn = document.getElementById("authBtn");

  authBtn.addEventListener("click", function(){

  if(authBtn.innerText === "Logout"){
    auth.signOut().then(()=>{
      location.reload();
    });
    return; // 🔥 important
  }

  const provider = new firebase.auth.GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: "select_account"
  });

  auth.signInWithPopup(provider).then(async (result)=>{

  let email = result.user.email;

  let doc = await db.collection("users").doc(email).get();

  if(doc.exists){
    let d = doc.data();
    updateProfile(d);
    authBtn.innerText="Logout";
    alert("Welcome " + d.name + " 🔥");
  } else {
    document.getElementById("email").value = email;
    document.getElementById("detailsPopup").style.display="flex";
  }

}).catch((error)=>{
  console.log("Login Error:", error);
});

});

  auth.onAuthStateChanged(async (user)=>{

  if(user){

    let email = user.email;

    let doc = await db.collection("users").doc(email).get();

    if(doc.exists){
      let d = doc.data();
      updateProfile(d);
      authBtn.innerText = "Logout";

      /* ================= WALLET SYSTEM ================= */

/* 🟢 OPEN ADD MONEY */
window.openAddMoney = function(){
  document.getElementById("addMoneyPopup").style.display = "flex";
}

/* 🔴 OPEN WITHDRAW */
window.openWithdraw = function(){
  document.getElementById("withdrawPopup").style.display = "flex";
}

/* ❌ CLOSE POPUPS */
window.closePopup = function(id){
  document.getElementById(id).style.display = "none";
}

/* 💰 ADD MONEY STEP 1 */
window.submitAddMoney = function(){

  let amount = document.getElementById("addAmount").value;

  if(!amount || amount <= 0){
    alert("Enter valid amount");
    return;
  }

  document.getElementById("upiAmountText").innerText = amount;
  document.getElementById("addMoneyPopup").style.display = "none";
  document.getElementById("paymentPopup").style.display = "flex";
}

/* 💸 FINAL CONFIRM ADD MONEY */
window.confirmPayment = function(){

  let amount = document.getElementById("upiAmountText").innerText;
  let txnId = document.getElementById("txnId").value;
  let name = document.getElementById("payerName").value;

  if(!txnId || !name){
    alert("Fill all details");
    return;
  }

  let history = JSON.parse(localStorage.getItem("transactions")) || [];

  history.unshift({
    type: "credit",
    amount: amount,
    status: "pending",
    time: new Date().toLocaleString()
  });

  localStorage.setItem("transactions", JSON.stringify(history));

  alert("Request submitted, wait for approval");

  closePopup("paymentPopup");
  loadTransactions();
}

/* 🏧 WITHDRAW REQUEST */
window.submitWithdraw = function(){

  let amount = document.getElementById("withdrawAmount").value;

  if(!amount || amount <= 0){
    alert("Enter valid amount");
    return;
  }

  let history = JSON.parse(localStorage.getItem("transactions")) || [];

  history.unshift({
    type: "debit",
    amount: amount,
    status: "pending",
    time: new Date().toLocaleString()
  });

  localStorage.setItem("transactions", JSON.stringify(history));

  alert("Withdraw request submitted");

  closePopup("withdrawPopup");
  loadTransactions();
}

/* 📜 LOAD TRANSACTIONS */
function loadTransactions(){

  let historyBox = document.getElementById("history");
  let history = JSON.parse(localStorage.getItem("transactions")) || [];

  if(history.length === 0){
    historyBox.innerHTML = "<p>No transactions yet</p>";
    return;
  }

  historyBox.innerHTML = "";

  history.forEach(tx => {

    let color = "yellow";

    if(tx.status === "approved"){
      color = tx.type === "credit" ? "limegreen" : "red";
    }

    if(tx.status === "rejected"){
      color = "red";
    }

    let sign = tx.type === "credit" ? "+" : "-";

    historyBox.innerHTML += `
      <p style="color:${color}">
        ${sign}₹${tx.amount} - ${tx.status} <br>
        <small>${tx.time}</small>
      </p>
    ;
  `});
}

/* 🔄 LOAD ON START */
loadTransactions();

  } else {
    authBtn.innerText = "Login";
    document.getElementById("profileText").innerText = "Login karo";
  }
});


  /* SAVE DETAILS */
  window.saveDetails = function(){

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let ign = document.getElementById("ign").value;
    let uid = document.getElementById("uid").value;

    // ✅ FIXED LINE
    if(!name || !phone || !ign || !uid){
      alert("Fill all fields");
      return;
    }

    if(!phone.startsWith("+91")){
      alert("Phone must start with +91");
      return;
    }

    let data = {
      name,
      phone,
      email,
      ign,
      uid,
      matches:0,
      kills:0,
      lastUpdated:Date.now()
    };

    db.collection("users").doc(email).set(data);

    updateProfile(data);

    authBtn.innerText="Logout";
    document.getElementById("detailsPopup").style.display="none";
  }

  /* PROFILE */
  function updateProfile(d){
    document.getElementById("profileText").innerHTML = `
      <p>${d.name}</p>
      <p>${d.phone}</p>
      <p>${d.email}</p>
      <hr>
      <p>IGN: ${d.ign}</p>
      <p>UID: ${d.uid}</p>
      <p>Matches: ${d.matches}</p>
      <p>Kills: ${d.kills}</p>

      <button class="btn" onclick="editProfile()">Edit Profile</button>
    `;
  }

  /* EDIT PROFILE */
  window.editProfile = function(){

    let user = auth.currentUser;
    if(!user) return;

    db.collection("users").doc(user.email).get().then(doc=>{

      let d = doc.data();

      document.getElementById("name").value = d.name;
      document.getElementById("phone").value = d.phone;
      document.getElementById("email").value = d.email;
      document.getElementById("ign").value = d.ign;
      document.getElementById("uid").value = d.uid;

      document.getElementById("detailsPopup").style.display="flex";

    });

  }

});
