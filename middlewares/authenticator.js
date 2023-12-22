const jwt = require("jsonwebtoken");

function authenticator(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Token is not provided, please login",
      status: 2,
    });
  }

  jwt.verify(token, "saurabh", (err, decode) => {
    if (err) {
      return res.status(401).json({
        message: "Token is not valid, please logins",
        status: 2,
      });
    }

    if (decode) {
      req.body.user = decode.userId;
      next();
    } else {
      res.status(401).json({
        message: "Token is not valid, please login",
        status: 2,
      });
    }
  });
}

module.exports = {
  authenticator,
};
