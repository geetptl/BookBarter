const jwt = require('jsonwebtoken');
const requireAuth = (req, res, next) => {
  let token;
  if(req.headers.authorization) {
    if (req.headers.authorization.startsWith('Bearer ')) {
      // postman workflow
        token = req.headers.authorization.replace(/['"]+/g, '').split(' ')[1];
    }
    else {
      // frontend workflow
      token = req.headers.authorization;
    }
  }
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required' });
  }
  else {
    try {
      const payload = jwt.verify(token, process.env.JWT_KEY);
      req.user_session = payload
      next();
    } catch (err) {
      console.log(err);
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }
  }
};

module.exports = requireAuth;