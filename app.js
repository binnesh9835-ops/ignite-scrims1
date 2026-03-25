document.addEventListener("DOMContentLoaded", function () {

  console.log("🔥 JS Loaded");

  /* ================= TABS ================= */
  const tabs = document.querySelectorAll(".tab");
  const sections = document.querySelectorAll(".section");

  tabs.forEach(btn => {
    btn.addEventListener("click", function () {

      let tabName = btn.dataset.tab;

      if (tabName) {
        tabs.forEach(t => t.classList.remove("active"));
        sections.forEach(s => s.classList.remove("active"));

        btn.classList.add("active");

        let target = document.getElementById(tabName);
        if (target) target.classList.add("active");
      }

    });
  });

  /* ================= FIREBASE ================= */
  firebase.initializeApp({
    apiKey: "AIzaSyCgyT_wRam-8FWkq5VePffFtymUMbRnXCQ",
    authDomain: "ignite-scrims.firebaseapp.com",
    projectId: "ignite-scrims"
  });

  const auth = firebase.auth();
  const db = firebase.firestore();

  const authBtn = document.getElementById("authBtn");

  /* ================= LOGIN ================= */
  authBtn.addEventListener("click", function () {

    if (authBtn.innerText === "Logout") {
      auth.signOut().then(() => location.reload());
      return;
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    auth.signInWithPopup(provider).then(async (result) => {

      let email = result.user.email;

      let doc = await db.collection("users").doc(email).get();

      if (doc.exists) {
        updateProfile(doc.data());
        authBtn.innerText = "Logout";
        alert("Welcome 🔥");
      } else {
        document.getElementById("email").value = email;
        document.getElementById("detailsPopup").style.display = "flex";
      }

    }).catch(err => console.log(err));

  });

  /* ================= AUTH STATE ================= */
  auth.onAuthStateChanged(async (user) => {

    if (!user) {
      authBtn.innerText = "Login";
      document.getElementById("profileText").innerText = "Login karo";
      return;
    }

    let doc = await db.collection("users").doc(user.email).get();

    if (doc.exists) {

      updateProfile(doc.data());
      authBtn.innerText = "Logout";

      /* ================= WALLET ================= */

      window.openAddMoney = function () {
        document.getElementById("addMoneyPopup").style.display = "flex";
      }

      window.openWithdraw = function () {
        document.getElementById("withdrawPopup").style.display = "flex";
      }

      window.closePopup = function (id) {
        document.getElementById(id).style.display = "none";
      }

      /* ADD MONEY */
      window.confirmAmount = function () {

        let amount = document.getElementById("amountInput").value;

        if (!amount || isNaN(amount) || amount <= 0) {
          alert("Enter valid amount");
          return;
        }

        document.getElementById("payAmount").innerText = "₹" + amount;

        closePopup("addMoneyPopup");
        document.getElementById("paymentPopup").style.display = "flex";
      }

      /* PAYMENT */
      window.submitPayment = function () {

        let amount = document.getElementById("payAmount").innerText.replace("₹", "");
        let txnId = document.getElementById("txnId").value;
        let name = document.getElementById("payerName").value;

        if (!txnId || !name) {
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

        alert("Request submitted");

        closePopup("paymentPopup");
        loadTransactions();
      }

      /* WITHDRAW */
      window.submitWithdraw = function () {

        let amount = document.getElementById("withdrawAmount").value;
        if (!amount  isNaN(amount)  amount <= 0) {
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

      /* LOAD TRANSACTIONS */
      function loadTransactions() {

        let box = document.getElementById("history");
        let history = JSON.parse(localStorage.getItem("transactions")) || [];

        if (!box) return;

        if (history.length === 0) {
          box.innerHTML = "<p>No transactions yet</p>";
          return;
        }

        box.innerHTML = "";

        history.forEach(tx => {

          let color = "yellow";

          if (tx.status === "approved") {
            color = tx.type === "credit" ? "limegreen" : "red";
          }

          if (tx.status === "rejected") {
            color = "red";
          }

          let sign = tx.type === "credit" ? "+" : "-";

          box.innerHTML += 
            <p style="color:${color}">
              ${sign}₹${tx.amount} - ${tx.status} <br>
              <small>${tx.time}</small>
            </p>
          ;
        });
      }

      loadTransactions();

    } else {
      authBtn.innerText = "Login";
    }

  });

  /* ================= SAVE DETAILS ================= */
  window.saveDetails = function () {

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let ign = document.getElementById("ign").value;
    let uid = document.getElementById("uid").value;

    if (!name  !phone  !ign || !uid) {
      alert("Fill all fields");
      return;
    }

    if (!phone.startsWith("+91")) {
      alert("Phone must start with +91");
      return;
    }

    let data = {
      name,
      phone,
      email,
      ign,
      uid,
      matches: 0,
      kills: 0,
      lastUpdated: Date.now()
    };

    db.collection("users").doc(email).set(data);

    updateProfile(data);

    authBtn.innerText = "Logout";
    document.getElementById("detailsPopup").style.display = "none";
  }

  /* ================= PROFILE ================= */
  function updateProfile(d) {

    document.getElementById("profileText").innerHTML = 
      <p>${d.name}</p>
      <p>${d.phone}</p>
      <p>${d.email}</p>
      <hr>
      <p>IGN: ${d.ign}</p>
      <p>UID: ${d.uid}</p>
      <p>Matches: ${d.matches}</p>
      <p>Kills: ${d.kills}</p>

      <button class="btn" onclick="editProfile()">Edit Profile</button>
    ;
  }

  window.editProfile = function () {

    let user = auth.currentUser;
    if (!user) return;

    db.collection("users").doc(user.email).get().then(doc => {

      let d = doc.data();

      document.getElementById("name").value = d.name;
      document.getElementById("phone").value = d.phone;
      document.getElementById("email").value = d.email;
      document.getElementById("ign").value = d.ign;
      document.getElementById("uid").value = d.uid;

      document.getElementById("detailsPopup").style.display = "flex";

    });

  }

});
