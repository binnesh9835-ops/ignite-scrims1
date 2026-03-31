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
  setDoc
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


// 🔥 GOOGLE LOGIN FUNCTION (REAL)
async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // 🔥 USER AUTO SAVE (FIRST TIME)
    await setDoc(doc(db, "users", user.uid), {
      name: user.displayName || "",
      email: user.email || ""
    }, { merge: true });

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
