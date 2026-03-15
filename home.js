// home.js
window.addEventListener("DOMContentLoaded", () => {
  const homeSection = document.getElementById("home");

  // Example matches schedule (for testing, admin will set real matches)
  const matches = [
    { id: 1, time: "15:30", entryFee: 50, prize: 500 },
    { id: 2, time: "16:00", entryFee: 100, prize: 1000 },
  ];

  function getNextMatch() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (let match of matches) {
      const [h, m] = match.time.split(":").map(Number);
      const matchMinutes = h * 60 + m;
      if (matchMinutes > currentMinutes) return match;
    }
    return null;
  }

  function renderNextMatch() {
    homeSection.innerHTML = 
      <div class="upcoming">Upcoming Matches</div>
    ;
    const nextMatch = getNextMatch();
    const container = document.createElement("div");
    container.style.marginTop = "20px";

    if (!nextMatch) {
      container.textContent = "No upcoming matches";
    } else {
      container.innerHTML = 
        <div>
          <strong>Time:</strong> ${nextMatch.time} &nbsp; 
          <strong>Entry Fee:</strong> ₹${nextMatch.entryFee} &nbsp; 
          <strong>Prize:</strong> ₹${nextMatch.prize} 
          <button id="joinBtn">Join</button>
        </div>
      ;
      container.querySelector("#joinBtn").onclick = () => {
        let joinedMatches = JSON.parse(localStorage.getItem("joinedMatches")) || [];
        if (joinedMatches.find(m => m.id === nextMatch.id)) {
          alert("Already joined this match");
          return;
        }
        joinedMatches.push({ ...nextMatch, kills: 0, rewardCollected: false });
        localStorage.setItem("joinedMatches", JSON.stringify(joinedMatches));
        alert("Successfully joined match!");
      };
    }
    homeSection.appendChild(container);
  }

  renderNextMatch();
});
