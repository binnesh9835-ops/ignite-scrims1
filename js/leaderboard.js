import { db } from "./firebase.js";
import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function loadLeaderboard(){

    const box = document.getElementById("leaderboard");

    const snap = await getDocs(collection(db,"users"));

    let arr = [];

    snap.forEach(docSnap=>{
        const u = docSnap.data();

        if(u.isCreator){
            arr.push(u);
        }
    });

    // 🔥 SORT BY KILLS
    arr.sort((a,b)=> (b.monthlyKills||0) - (a.monthlyKills||0));

    // 🔥 TOP 50
    arr = arr.slice(0,50);

    box.innerHTML = "";

    arr.forEach((u,i)=>{

        box.innerHTML += `
            <div class="card">
                #${i+1} ⭐ ${u.name || "Creator"} <br>
                Kills: ${u.monthlyKills || 0}
            </div>
        `;
    });
}

loadLeaderboard();

if(!localStorage.getItem("leaderboardSeen")){
    alert("This leaderboard shows top creators based on kills.\nIt resets every 30 days.\nPlay more to rank higher!");
    localStorage.setItem("leaderboardSeen", "yes");
}
