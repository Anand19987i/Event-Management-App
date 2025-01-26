import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";

export const authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    try {
        // Decode the token to check expiration date
        const decoded = jwt.decode(token);
        if (decoded && decoded.exp < Date.now() / 1000) {
            return res.status(401).json({ message: "Token expired" });
        }

        // Verify the token using the secret key
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(verified._id).select('-password');
        
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        return res.status(401).json({ message: 'Invalid token' });
    }
};
