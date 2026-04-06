const jwt = require("jsonwebtoken");

const authCheck = (req, res, next) => {
  if (req.cookies && req.cookies.userToken) {
    jwt.verify(
      req.cookies.userToken,
      process.env.JWT_SECRET_KEY,
      (err, data) => {
        if (err) {
          return next();
        }
        req.user = data;
        return next();
      },
    );
  } else {
    req.user = null;
    return next();
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect("/login/view");
    }
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .send("<h1>You don't have permission to access this page</h1>");
    }
    return next();
  };
};

module.exports = { authCheck, authorize };
