// Middlewares for Assistant JWT Authentication
import jwt from 'jsonwebtoken';
import { JWT_SECRET} from '../config/config.js';

export default class Authenticator{
    static async loginAuthenticator(req, res, next){
        const token = req.headers['Authorization'];
        if(!token){
            return res.status(403).send({ message: "Unauthorized - No token provided!" });
        }
        try{ 
           const token = tokenHeader.split(' ')[1];    
           const decoded = jwt.verify(token, JWT_SECRET);
           req.user = decoded.user;
           next()
        }catch(err){
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

    }

    static async refreshTokenAuthenticator(req, res, next){
        const token = req.body.token;

        if (!token) {
            return res.status(403).send({ message: "Unauthorized - No token provided!" });
        }
    
        try {
            // Attempt to verify as an access token
            const decodedAccessToken = jwt.verify(token, JWT_SECRET);
            req.user = decodedAccessToken.user;
            next();
        } catch (accessTokenError) {
            // If verification fails as an access token, try as a refresh token
            try {
                const decodedRefreshToken = jwt.verify(token, REFRESH_TOKEN_SECRET);
                req.user = decodedRefreshToken.user;
                next();
            } catch (refreshTokenError) {
                console.error(accessTokenError, refreshTokenError);
                return res.status(401).json({ message: 'Unauthorized - Invalid token' });
            }
        }
    }

}
  