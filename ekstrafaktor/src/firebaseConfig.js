import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCvZsi0GbjFNvPhjzPJ4cPAZc-_9z73HDA",
    authDomain: "ekstrafaktor.firebaseapp.com",
    projectId: "ekstrafaktor",
    storageBucket: "ekstrafaktor.appspot.com",
    messagingSenderId: "493498949331",
    appId: "1:493498949331:web:0c8ebfb133c6670538fe26"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  export { auth, db };