// Firebase Configuration and Initialization
const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAXhvhxCOaKgTRCONSx_bUHtIU97oO_ZAA",
  authDomain: "eng-lms.firebaseapp.com",
  databaseURL: "https://eng-lms-default-rtdb.firebaseio.com",
  projectId: "eng-lms",
  storageBucket: "eng-lms.firebasestorage.app",
  messagingSenderId: "149064402746",
  appId: "1:149064402746:web:1b045504835f33bb93b203",
  measurementId: "G-YJ0BJCFRW3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const firestore = getFirestore(app);

module.exports = { app, db, firestore };
