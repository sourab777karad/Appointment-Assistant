import { initializeApp } from "firebase/app";

import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyC3n_giJsoJsyVBWB6Bp4kWAjibEofEALo",
	projectId: "banded-access-416709",
	authDomain: "banded-access-416709.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

export { app, provider };
