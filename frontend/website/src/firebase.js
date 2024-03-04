import {
	initializeApp,
} from "firebase/app";

import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyCiQAtx17n-LmaZRK5Gq7yCPYURG19ZSUE",
	projectId: "appointment-assistant-2c9de",
	authDomain: "appointment-assistant-2c9de.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();


export { app, provider };