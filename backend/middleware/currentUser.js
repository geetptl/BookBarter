const asyncHandler = require('async-handler');
const jwt = require('jsonwebtoken');

const currentUser = asyncHandler(async (req, res, next) => {
    let token;
    console.log("HELLO!")
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        
        token = req.headers.authorization.replace(/['"]+/g, '').split(' ')[1]; // Remove double quotes
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_KEY);
        req.currentUser = payload.user;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }
    
});

module.exports = currentUser;
