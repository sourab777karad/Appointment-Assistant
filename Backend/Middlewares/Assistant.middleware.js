// Middlewares for Assistant JWT Authentication
import jwt from 'jsonwebtoken';
import { JWT_SECRET , REFRESH_TOKEN_SECRET} from '../config/config.js';

const users =[
    { id: 1, name: 'John', email:'1234@gmail.com', password: 'password'},
    { id: 2, name: 'Doe', email:'4123@gmail.com', password: 'password' }
]
export default class Authenticator{
    static async loginAuthenticator(req, res, next){
        try{
            const { email, password } = req.body;
            // const user = await AssistantDAO.login(email, password);
            console.log(email + " " + password);
           
            const user = users.find(user => user.email === email && user.password === password);
            console.log(user);
           
            if(!user){
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '20' });
            req.user = user; // Attach the user object to the request if needed
            req.token = token; // Attach the token to the request if needed
            next();
        }catch(err){
            return res.status(500).json({ message: "Internal server error", error: err});
        }
        
    }

    static async refreshTokenAuthenticator(req, res, next){
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
    
            if (!token) {
                return res.status(403).send({ message: "Unauthorized - No token provided!" });
            }
    
            try {
                // Attempt to verify as an access token
                const decodedAccessToken = jwt.decode(token);
                req.user = decodedAccessToken;
                next();
            } catch (accessTokenError) {
                // If verification fails as an access token, try as a refresh token
                try {
                    const decodedRefreshToken = jwt.verify(token, REFRESH_TOKEN_SECRET);
                    req.user = decodedRefreshToken;
                    next();
                } catch (refreshTokenError) {
                    console.error(accessTokenError, refreshTokenError);
                    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
                }
            }
    }

}
  