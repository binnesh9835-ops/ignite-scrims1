document.addEventListener("DOMContentLoaded", function(){

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

  /* LOGIN */
  authBtn.addEventListener("click", function(){

    if(authBtn.innerText === "Logout"){
      auth.signOut().then(()=>location.reload());
      return;
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    auth.signInWithPopup(provider).then(async (result)=>{

      let email = result.user.email;
      let doc = await db.collection("users").doc(email).get();

      if(doc.exists){
        updateProfile(doc.data());
        authBtn.innerText="Logout";
        loadWallet();
      } else {
        document.getElementById("email").value = email;
        openPopup("detailsPopup");
      }

    });

  });

  /* AUTH STATE */
  auth.onAuthStateChanged(async (user)=>{

    if(!user){
      authBtn.innerText="Login";
      document.getElementById("profileText").innerText="Login karo";
      return;
    }

    let doc = await db.collection("users").doc(user.email).get();

    if(doc.exists){
      updateProfile(doc.data());
      authBtn.innerText="Logout";
      loadWallet();
    }

  });

  /* SAVE PROFILE */
  window.saveDetails = function(){

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let ign = document.getElementById("ign").value;
    let uid = document.getElementById("uid").value;

    if(!name || !phone || !ign || !uid){
      alert("Fill all fields");
      return;
    }

    let data = {
      name, phone, email, ign, uid,
      deposit: 0,
      winning: 0,
      transactions: []
    };

    db.collection("users").doc(email).set(data);

    updateProfile(data);
    closePopup("detailsPopup");
    authBtn.innerText="Logout";
  }

  function updateProfile(d){
    document.getElementById("profileText").innerHTML = 
      <p>${d.name}</p>
      <p>${d.phone}</p>
      <p>${d.email}</p>
      <hr>
      <p>IGN: ${d.ign}</p>
      <p>UID: ${d.uid}</p>

      <button class="btn" onclick="editProfile()">Edit Profile</button>
    ;
  }

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

      openPopup("detailsPopup");
    });

  }

});
