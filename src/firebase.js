import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword as createUserAuth, signInWithEmailAndPassword as signInUserAuth, signOut as signOutUser } from "firebase/auth";
import { getDatabase, ref, set, push, onValue, remove, update } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCAW-5h3sSU-fqBAcDMAK3Qc7lFDPHXhnY",
    authDomain: "cyclink-3faf4.firebaseapp.com",
    databaseURL: "https://cyclink-3faf4-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cyclink-3faf4",
    storageBucket: "cyclink-3faf4.appspot.com",
    messagingSenderId: "221779461740",
    appId: "1:221779461740:web:629a84363659c793f67a49"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database, ref, push, onValue, remove, set, update };
export { createUserAuth, signInUserAuth, signOutUser };
export const createUserProfile = (uid, email) => {
    return set(ref(database, `users/${uid}`), { email });
};



export default app;