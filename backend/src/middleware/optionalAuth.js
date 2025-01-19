const { auth } = require("express-oauth2-jwt-bearer");
require("dotenv").config();

const authConfig = {
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
};

const checkJwt = auth({
  audience: authConfig.audience,
  issuerBaseURL: `https://${authConfig.domain}`,
  tokenSigningAlg: "RS256",
});

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    return checkJwt(req, res, next);
  }

  next();
};

module.exports = optionalAuth;
