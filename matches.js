// matches.js
window.addEventListener("DOMContentLoaded", () => {
  const matchesSection = document.getElementById("matches");

  function renderJoinedMatches() {
    const joinedMatches = JSON.parse(localStorage.getItem("joinedMatches")) || [];
    matchesSection.innerHTML = "<h2>My Matches</h2>";

    if (joinedMatches.length === 0) {
      matchesSection.innerHTML += "<p>No joined matches</p>";
      return;
    }

    joinedMatches.forEach(match => {
      const div = document.createElement("div");
      div.style.margin = "15px";
      div.style.padding = "10px";
      div.style.border = "1px solid #444";
      div.innerHTML = 
        <strong>Time:</strong> ${match.time} &nbsp;
        <strong>Entry Fee:</strong> ₹${match.entryFee} &nbsp;
        <strong>Prize:</strong> ₹${match.prize}
        <button>View Details</button>
      ;
      div.querySelector("button").onclick = () => {
        alert(
Match Details:
Time: ${match.time}
Entry Fee: ₹${match.entryFee}
Prize: ₹${match.prize}
Kills: ${match.kills}
Reward Collected: ${match.rewardCollected ? "Yes" : "No"}
        );
      };
      matchesSection.appendChild(div);
    });
  }

  renderJoinedMatches();
});
