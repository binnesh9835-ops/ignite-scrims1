// wallet.js
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

  let walletBalance = parseInt(localStorage.getItem("walletBalance")) || 0;
  let walletHistory = JSON.parse(localStorage.getItem("walletHistory")) || [];
  let notifications = localStorage.getItem("notifications") === "true";

  balanceSpan.textContent = walletBalance;
  notifyToggle.checked = notifications;

  function renderHistory() {
    historyDiv.innerHTML = "";
    walletHistory.forEach(tx => {
      const div = document.createElement("div");
      div.textContent = ${tx.type} ₹${tx.amount} on ${tx.date} ${tx.status ? "(Completed)" : "(Pending)"};
      historyDiv.appendChild(div);
    });
  }

  renderHistory();

  document.getElementById("addBtn").onclick = () => {
    const amt = parseInt(addInput.value);
    if (isNaN(amt) || amt < 20) {
      alert("Minimum add amount is ₹20");
      return;
    }
    walletBalance += amt;
    balanceSpan.textContent = walletBalance;
    walletHistory.push({ type: "Add", amount: amt, date: new Date().toLocaleString(), status: true });
    localStorage.setItem("walletBalance", walletBalance);
    localStorage.setItem("walletHistory", JSON.stringify(walletHistory));
    renderHistory();
    alert("Money added successfully!");
  };

  document.getElementById("withdrawBtn").onclick = () => {
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
    walletBalance -= amt;
    balanceSpan.textContent = walletBalance;
    walletHistory.push({ type: "Withdraw", amount: amt, date: new Date().toLocaleString(), status: false, upi });
    localStorage.setItem("walletBalance", walletBalance);
    localStorage.setItem("walletHistory", JSON.stringify(walletHistory));
    renderHistory();
    alert("Withdrawal request submitted! Admin will verify payment.");
  };

  notifyToggle.onchange = () => {
    localStorage.setItem("notifications", notifyToggle.checked);
  };
});
