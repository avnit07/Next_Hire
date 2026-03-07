// Verifies the JWT token from cookies to protect private routes

import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // Prefer Bearer token from header (works on all devices); fall back to cookie
        const authHeader = req.headers.authorization;
        const token = (authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1])
            || req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated.",
                success: false,
            });
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token.",
                success: false
            });
        }

        req.id = decode.userId;
        next();
    } catch (error) {
        // Catches expired tokens or tampered signatures
        return res.status(401).json({
            message: "Authentication failed.",
            success: false,
        });
    }
}

export default isAuthenticated;