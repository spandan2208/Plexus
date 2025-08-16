// auth.js
import jwt from 'jsonwebtoken';
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }
        
        const token = authHeader.split(' ')[1]; // Extract the token after 'Bearer '

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // As you've fixed in the previous response, the key is 'id'
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            console.error(`User not found for token with ID: ${decoded.id}`);
            return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error(error.message);
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
};