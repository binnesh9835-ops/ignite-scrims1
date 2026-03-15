window.addEventListener("DOMContentLoaded", () => {
  const walletSection = document.getElementById("wallet");
  walletSection.innerHTML = 
    <h2>Wallet</h2>
    <p>Balance: ₹<span id="walletBalance">0</span></p>
    <input type="number" id="addAmount" placeholder="Amount to Add">
    <button id="addBtn">Add Money</button>
    <br><br>
    <input type="number" id="withdrawAmount" placeholder="Amount to Withdraw">
    <input type="text" id="upiId" placeholder="Your UPI ID">
    <button id="withdrawBtn">Withdraw</button>
    <h3>Transaction History</h3>
    <div id="walletHistory"></div>
    <br>
    <label><input type="checkbox" id="notifyToggle"> Enable Notifications</label>
  ;

  const balanceSpan = document.getElementById("walletBalance");
  const addInput = document.getElementById("addAmount");
  const withdrawInput = document.getElementById("withdrawAmount");
  const upiInput = document.getElementById("upiId");
  const historyDiv = document.getElementById("walletHistory");
  const notifyToggle = document.getElementById("notifyToggle");

  // Load wallet data
  let walletBalance = parseInt(localStorage.getItem("walletBalance")) || 0;
  let walletHistory = JSON.parse(localStorage.getItem("walletHistory")) || [];
  let notifications = localStorage.getItem("notifications") === "true";

  balanceSpan.textContent = walletBalance;
  notifyToggle.checked = notifications;

  function renderHistory() {
    historyDiv.innerHTML = "";
    walletHistory.forEach(tx => {
      const div = document.createElement("div");
      div.textContent = ${tx.type} ₹${tx.amount} on ${tx.date} ${tx.status ? "(Completed)" : "(Pending)"}${tx.upi ? " | UPI: " + tx.upi : ""};
      historyDiv.appendChild(div);
    });
  }

  renderHistory();

  // --- Add Money ---
  addBtn.onclick = () => {
    const amt = parseInt(addInput.value);
    if (isNaN(amt) || amt < 20) {
      alert("Minimum add amount is ₹20");
      return;
    }

    const username = localStorage.getItem("username");
    if (!username) {
      alert("Please set your username first!");
      return;
    }

    // For now, mark as pending; Admin/Owner approval will update status
    walletHistory.push({
      type: "Add",
      amount: amt,
      date: new Date().toLocaleString(),
      status: false, // pending
      username: username
    });
    localStorage.setItem("walletHistory", JSON.stringify(walletHistory));

    alert(🎉 Your Add Money request of ₹${amt} has been sent for admin approval. Please wait.);

    addInput.value = "";
    renderHistory();
  };

  // --- Withdraw Money ---
  withdrawBtn.onclick = () => {
    const amt = parseInt(withdrawInput.value);
    const upi = upiInput.value.trim();

    if (isNaN(amt)  amt < 200  amt > 1000) {
      alert("Withdraw amount must be ₹200 - ₹1000");
      return;
    }
    if (amt > walletBalance) {
      alert("Insufficient balance");
      return;
    }
    if (!upi) {
      alert("Enter your UPI ID");
      return;
    }

    const username = localStorage.getItem("username");
    if (!username) {
      alert("Please set your username first!");
      return;
    }

    // Deduct temporarily, final completion after admin approval
    walletBalance -= amt;
    balanceSpan.textContent = walletBalance;

    walletHistory.push({
      type: "Withdraw",
      amount: amt,
      date: new Date().toLocaleString(),
      status: false, // pending
      upi: upi,
      username: username
    });
    localStorage.setItem("walletBalance", walletBalance);
    localStorage.setItem("walletHistory", JSON.stringify(walletHistory));

    alert(🎉 Your Withdraw request of ₹${amt} has been sent for admin verification.);
    withdrawInput.value = "";
    upiInput.value = "";
    renderHistory();
  };

  // --- Notifications toggle ---
  notifyToggle.onchange = () => {
    localStorage.setItem("notifications", notifyToggle.checked);
  };
});
