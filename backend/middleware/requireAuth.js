
const requireAuth = (req, res, next) => {
  console.log("req");
  console.log(req);
  console.log("req.currentUser:", req.currentUser);

  // need to Google this. How is user accessed in req?
  if (!req.currentUser) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required' });
  }
};

module.exports = requireAuth;
