import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // 👈 Cambiamos a la función estándar y segura
import { getFirestore } from "firebase/firestore";

// Tus credenciales reales de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDDlI28SHcao1IInHjRqXVEdOy_Ys0016o",
  authDomain: "expo-nosql-individual.firebaseapp.com",
  projectId: "expo-nosql-individual",
  storageBucket: "expo-nosql-individual.firebasestorage.app",
  messagingSenderId: "350620992690",
  appId: "1:350620992690:web:ffc32c22a618b467b135ab",
  measurementId: "G-GD00NDE7NK"
};

// Inicializacion de  la aplicación de Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// Inicio de la base de datos Firestore NoSQL
const db = getFirestore(app);

export { auth, db };