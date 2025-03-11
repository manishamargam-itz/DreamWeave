import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    try {
        let token;

        console.log("🔹 Request Headers:", req.headers); // Debugging headers

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.headers.token) { 
            token = req.headers.token;
        }

        if (!token) {
            console.log("❌ No token received");
            return res.status(401).json({ success: false, message: "Not Authorized. Please log in again." });
        }

        console.log("🔹 Received Token:", token);

        // Verify token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("✅ Decoded Token:", decoded);
            req.body.userId = decoded.id; // Attach userId properly
            next();
        } catch (error) {
            console.error("❌ Token Verification Error:", error.message);
            return res.status(401).json({ success: false, message: "Invalid or expired token." });
        }

    } catch (error) {
        console.error("❌ JWT Error:", error.message);
        return res.status(401).json({ success: false, message: "Unauthorized access" });
    }
};

export default userAuth;
