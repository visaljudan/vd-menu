// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXrNI6ahZeF1iWorJck3H7QgqbViCcQNY",
  authDomain: "jojuh-image.firebaseapp.com",
  projectId: "jojuh-image",
  storageBucket: "jojuh-image.appspot.com",
  messagingSenderId: "480711513027",
  appId: "1:480711513027:web:89fc4dbfa14e08bfdc2376",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
