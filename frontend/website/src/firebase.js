import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC3n_giJsoJsyVBWB6Bp4kWAjibEofEALo",
  projectId: "banded-access-416709",
  authDomain: "banded-access-416709.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { app, provider, auth };
