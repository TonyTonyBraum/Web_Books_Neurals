// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYjgQ7oJ-LfzkOZfeFuk7DcuIHjaprig8",
  authDomain: "web-books-neurals.firebaseapp.com",
  databaseURL: "https://web-books-neurals-default-rtdb.firebaseio.com",
  projectId: "web-books-neurals",
  storageBucket: "web-books-neurals.firebasestorage.app",
  messagingSenderId: "104777293463",
  appId: "1:104777293463:web:ffc3b95f0b35a1711e93d2"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Get references
const db = firebase.database();
const storage = firebase.storage();