const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");

const authCheck = async (req, res, next) => {
  const accessToken = req.cookies?.userToken;
  const refreshToken = req.cookies?.refreshToken;

  if (accessToken) {
    try {
      const data = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
      req.user = data;
      return next(); 
    } catch (err) {
    }
  }

  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
      const user = await User.findById(decoded.id);

      if (user && user.isActive && user.refreshToken && user.refreshToken.length > 0) {
        
        let isValidToken = false;
        for (const hashedToken of user.refreshToken) {
          const isMatch = await bcryptjs.compare(refreshToken, hashedToken);
          if (isMatch) {
            isValidToken = true;
            break;
          }
        }
        
        if (isValidToken) {
          const newAccessToken = jwt.sign(
            { id: user._id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "15m" }
          );

          res.cookie("userToken", newAccessToken, { httpOnly: true });
          
          req.user = { id: user._id, name: user.name, email: user.email, role: user.role };
          return next();
        }
      }
    } catch (err) {
    }
  }

  req.user = null;
  return next();
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