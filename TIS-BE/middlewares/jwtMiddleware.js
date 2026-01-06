const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized",
    });
  }

  const token = auth.replace("Bearer ", "");

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
