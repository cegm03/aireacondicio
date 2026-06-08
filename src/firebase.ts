// Firebase SDK imports
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD2qhzupVNV3K2mCFJQsmz5Ftjg9oThwps",
    authDomain: "airconditiondatabase.firebaseapp.com",
    databaseURL: "https://airconditiondatabase-default-rtdb.firebaseio.com/data.json",
    projectId: "airconditiondatabase",
    storageBucket: "airconditiondatabase.firebasestorage.app",
    messagingSenderId: "704845705220",
    appId: "1:704845705220:web:dd1bf42572083e79c04551",
    measurementId: "G-RJ4VK1ML9C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Realtime Database instance
export const db = getDatabase(app);