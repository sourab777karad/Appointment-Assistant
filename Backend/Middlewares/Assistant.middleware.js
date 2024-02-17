// Middlewares for Assistant JWT Authentication
import jwt from 'jsonwebtoken';
import { JWT_SECRET , REFRESH_TOKEN_SECRET} from '../config/config.js';
import firebase from 'firebase-admin';
const users =[
    { id: 1, name: 'John', email:'1234@gmail.com', password: 'password'},
    { id: 2, name: 'Doe', email:'4123@gmail.com', password: 'password' }
]
export default class Authenticator{
    // Middleware to authenticate Token
    static async TokenAuthenticator(req, res, next){
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(403).send({ message: "Unauthorized - No token provided!" });
        }

        try {
            // Verify the token using Firebase Admin SDK
            const decodedToken = await firebase.auth().verifyIdToken(token);
            req.user = decodedToken;
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }
    }

}
  