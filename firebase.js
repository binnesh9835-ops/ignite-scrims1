// Firebase Core
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// Firebase Services
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


// Firebase Config
const firebaseConfig = {

apiKey: "AIzaSyCgyT_wRam-8FWkq5VePffFtymUMbRnXCQ",

authDomain: "ignite-scrims.firebaseapp.com",

projectId: "ignite-scrims",

storageBucket: "ignite-scrims.firebasestorage.app",

messagingSenderId: "497561769270",

appId: "1:497561769270:web:ef4f215a253e984f2dcf97"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Services
const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);


// Export services so other files can use them
export { auth, db, storage };
