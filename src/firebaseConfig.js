import firebase from "firebase/compat/app";
import "firebase/auth";
import "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCodZJoXFnBThq3zv7pmGxecTMh5m5OdQA",
	authDomain: "capprop-814d3.firebaseapp.com",
	projectId: "capprop-814d3",
	storageBucket: "capprop-814d3.appspot.com",
	messagingSenderId: "211247913473",
	appId: "1:211247913473:web:bb08624700cf8cd7587e00",
};

const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
export { auth, app, db };
