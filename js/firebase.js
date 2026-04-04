// 🔥 IMPORTS (MODULAR FIREBASE)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// 🔥 YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCgyT_wRam-8FWkq5VePffFtymUMbRnXCQ",
  authDomain: "ignite-scrims.firebaseapp.com",
  projectId: "ignite-scrims",
  storageBucket: "ignite-scrims.firebasestorage.app",
  messagingSenderId: "497561769270",
  appId: "1:497561769270:web:ef4f215a253e984f2dcf97"
};


// 🔥 INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);


// 🔐 AUTH
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


// 🧠 FIRESTORE DATABASE
const db = getFirestore(app);


// 🔥 GOOGLE LOGIN FUNCTION (UPDATED SAFE)
async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);

    // 🔍 check user exists ya nahi
    const snap = await getDoc(userRef);

    // 🔥 ONLY FIRST TIME USER
    if (!snap.exists()) {
      await setDoc(userRef, {
        name: user.displayName || "",
        email: user.email || "",

        // 💰 DEFAULT WALLET
        balance: 0,
        winningBalance: 0,
        totalSpent: 0,
        totalWinning: 0,
        totalWithdraw: 0
      });
    }

    return user;

  } catch (error) {
    alert(error.message);
  }
}

// 🔓 LOGOUT FUNCTION
function logout() {
  return signOut(auth);
}


// 🔥 EXPORT SAB KUCH
export { auth, provider, db, loginWithGoogle, logout };
