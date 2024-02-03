// import AssistantDAO from "../DAO/AssistantDAO";
import jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_TOKEN_SECRET } from "../config/config.js";

// Dummy users for testing
const users =[
    { id: 1, name: 'John', email:' 1234@gmail.com ', password: 'password'},
    { id: 2, name: 'Doe', email:'4123@gmail.com', password: 'password' }
]

export default class AssistantController {

    // all methods
    static async login(req, res){
        try {
            const { user, token } = req;

            if (user && token) {
                return res.status(200).json({ data: user, token, message: 'Login successful' });
            }

            return res.status(401).json({ message: 'Invalid credentials' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
       
    }

    static async test(req, res){
        res.status(200).json({ message: 'Test successful' });
    }

    static async signup(req, res){
        try {
            const { email, password, name } = req.body;

            // Check if the user already exists
            const existingUser = await AssistantDAO.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Email already registered' });
            }

            // If not, create a new user
            const newUser = await AssistantDAO.create({ email, password, name });

            // Sign a JWT for the new user
            const token = jwt.sign({ userId: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

            return res.status(201).json({ data: newUser, token, message: 'Signup successful' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error', error: err.message });
        }
    }
    static async refreshToken(req, res) {
        try {
            const user = req.user;
            const newAccessToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    
            return res.status(200).json({ accessToken: newAccessToken, message: 'Token refreshed successfully' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error generating new access token' });
        }
    }
}