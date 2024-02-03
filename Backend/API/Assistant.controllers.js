import AssistantDAO from "../DAO/AssistantDAO";
import jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_TOKEN_SECRET } from "../config/config.js";

export default class AssistantController {

    // all methods
    static async login(req, res){
        try{
            const { email, password } = req.body;
            const assistant = await AssistantDAO.login(email, password);
            if(assistant){
                 // Sign a JWT with user information
                 const token = jwt.sign({ userId: assistant._id, email: assistant.email }, JWT_SECRET, { expiresIn: '1h' });
                 res.status(200).json({ data: assistant, token, message: "Login successful" })
            
            }
            return res.status(401).json({ message: "Invalid credentials" });
        }catch(err){
            return res.status(500).json({ message: "Internal server error", error: err});
        }
    }

    static async signup(req, res){
        try {
            const { email, password, name } = req.body;

            // Check if the user already exists
            const existingAssistant = await AssistantDAO.findByEmail(email);
            if (existingAssistant) {
                return res.status(400).json({ message: 'Email already registered' });
            }

            // If not, create a new user
            const newAssistant = await AssistantDAO.create({ email, password, name });

            // Sign a JWT for the new user
            const token = jwt.sign({ userId: newAssistant._id, email: newAssistant.email }, JWT_SECRET, { expiresIn: '1h' });

            return res.status(201).json({ data: newAssistant, token, message: 'Signup successful' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error', error: err.message });
        }
    }
    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;

            // Verify the refresh token
            const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

            // Get the user ID from the decoded token
            const userId = decoded.userId;

            // Fetch user data from the database 
            const user = await AssistantDAO.findById(userId);

            if (!user) {
                return res.status(401).json({ message: 'Invalid refresh token' });
            }

            // Issue a new access token
            const newAccessToken = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({ accessToken: newAccessToken, message: 'Token refreshed successfully' });
        } catch (err) {
            console.error(err);
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
    }
}