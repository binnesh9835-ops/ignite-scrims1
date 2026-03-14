// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCgyT_wRam-8FWkq5VePffFtymUMbRnXCQ",
  authDomain: "ignite-scrims.firebaseapp.com",
  projectId: "ignite-scrims",
  storageBucket: "ignite-scrims.firebasestorage.app",
  messagingSenderId: "497561769270",
  appId: "1:497561769270:web:ef4f215a253e984f2dcf97"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();
