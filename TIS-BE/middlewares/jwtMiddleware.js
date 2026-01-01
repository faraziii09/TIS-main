const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const authorization = req.headers.authorization;

  // No header
  if (!authorization) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized",
    });
  }

  // Not Bearer format
  if (!authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized",
    });
  }

  const token = authorization.slice(7);

  jwt.verify(token, JWT_SECRET, (err, data) => {
    if (err) {
      return res.status(403).json({
        status: false,
        message: "Invalid token",
      });
    }

    req.user = data?.id;
    return next();
  });
};
