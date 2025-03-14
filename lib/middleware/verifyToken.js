const admin = require("./firebase-admin");

// Verify token for some endpoints such as booking appointments,etc or some page need to be protected like profile page
const VerifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decodeValue = await admin.auth().verifyIdToken(token);
    req.user = decodeValue;
    next();
  } catch (e) {
    return res.status(401).send("Unauthorized");
  }
};

module.exports = { VerifyToken };
