const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  if (!config.get("requiresAuth")) return next();

  // do you have token?
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  // is you token valid?
  try {
    jwt.verify(token, config.get("jwtPrivateKey"));
    // if we get here then everything is ok
    next();
  } catch (err) {
    res.status(400).send("Invalid token.");
  }
};
