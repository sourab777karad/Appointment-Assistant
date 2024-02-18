// import AssistantDAO from "../DAO/AssistantDAO";
import jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_TOKEN_SECRET } from "../config/config.js";
import firebase from "firebase-admin";
import AssistantDAO from "../DAO/AssistantDAO.js";

// Dummy users for testing
const users =[
    { id: 1, name: 'John', email:' 1234@gmail.com ', password: 'password'},
    { id: 2, name: 'Doe', email:'4123@gmail.com', password: 'password' }
]

export default class AssistantController {

    
static async login(req, res) {
    try {
        const idToken = req.body.idToken;

        // Verify the ID token
        const decodedToken = await firebase.auth().verifyIdToken(idToken);

        // Get the user record
        const userRecord = await firebase.auth().getUser(decodedToken.uid);

        // If successful, return a success response
        return res.status(200).json({ data: userRecord, message: 'Login successful' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}
    static async test(req, res){
        res.status(200).json({ message: 'Test successful' });
    }

    static async signup(req, res) {
        try {
            const { email, password, name, room_address} = req.body;

            // Create a new user using Firebase Authentication
            const userRecord = await firebase.auth().createUser({
                email,
                password,
                displayName: name,
            });

            // Create a custom token
            const token = await firebase.auth().createCustomToken(userRecord.uid);
            
            const user = await AssistantDAO.newUser(email,name,room_address)
            // If successful, return a success response
            return res.status(201).json({ uid: userRecord.uid, token, message: 'Signup successful' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error', error: err.message });
        }
    }
    static async getAppointment(req, res) {
        try {
            const Ap_date = req.date;
            const appointment = await AssistantDAO.getAppointment(Ap_date);
    
            return res.status(200).json({ data: appointment, message: 'Appointment retrieved successfully' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error retrieving appointment' });
        }
    }
    static async setAppointment(req, res) {
        try {
            const { 
                appointee, 
                appointer, 
                creation_time, 
                appointment_time, 
                appointment_duration, 
                appointment_purpose, 
                appointment_description 
            } = req.body;
    
            const appointment = await AssistantDAO.SetAppointment({ 
                appointee, 
                appointer, 
                creation_time, 
                appointment_time, 
                appointment_duration, 
                appointment_purpose, 
                appointment_description 
            });

            return res.status(201).json({ data: appointment, message: 'Appointment set successfully' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error setting appointment' });
        }
    }
    
}