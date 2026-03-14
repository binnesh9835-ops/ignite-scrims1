// FIREBASE IMPORT

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// FIREBASE CONFIG

const firebaseConfig = {

  apiKey: "AIzaSyCgyT_wRam-8FWkq5VePffFtymUMbRnXCQ",

  authDomain: "ignite-scrims.firebaseapp.com",

  projectId: "ignite-scrims",

  storageBucket: "ignite-scrims.firebasestorage.app",

  messagingSenderId: "497561769270",

  appId: "1:497561769270:web:ef4f215a253e984f2dcf97"
};



// INITIALIZE FIREBASE

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);



// EXPORT

export { auth, db };
