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

  auth.signInWithRedirect(provider);

});

  /* LOGIN STATE */
  auth.onAuthStateChanged(async (user)=>{

    if(user){

      let email = user.email;

      let doc = await db.collection("users").doc(email).get();

      if(doc.exists){
        let d = doc.data();
        updateProfile(d);
        authBtn.innerText="Logout";
      } else {
        document.getElementById("email").value = email;
        document.getElementById("detailsPopup").style.display="flex";
      }

    }

  });

  auth.getRedirectResult().then(async (result)=>{

  if(result.user){

    let email = result.user.email;

    let doc = await db.collection("users").doc(email).get();

    if(doc.exists){
      let d = doc.data();
      updateProfile(d);
      authBtn.innerText="Logout";
    } else {
      document.getElementById("email").value = email;
      document.getElementById("detailsPopup").style.display="flex";
    }

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
