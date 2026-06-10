const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

class userAuthController {
  async registerView(req, res) {
    res.render("register");
  }

  async loginView(req, res) {
    res.render("login");
  }

  async registerCreate(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.redirect("/register/view");
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.redirect("/login/view");
      }
      const salt = await bcryptjs.genSalt(10);
      const hashPassword = await bcryptjs.hash(password, salt);

      const user = new User({
        name,
        email,
        password: hashPassword,
        role: "User",
      });

      const userData = await user.save();
      if (userData) {
        return res.redirect("/login/view");
      }
      return res.redirect("/register/view");
    } catch (err) {
      console.log(err);
      return res.redirect("/register/view");
    }
  }

  async loginCreate(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.redirect("/login/view");
      }
      const user = await User.findOne({ email });

      if (!user) {
        return res.redirect("/register/view");
      }
      if (user.isActive === false) {
        console.log("access denied");
        return res.redirect("/login/view");
      }

      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.redirect("/login/view");
      }

      const accessToken = jwt.sign(
        { id: user._id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" },
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET_KEY,
        { expiresIn: "7d" },
      );

      const hashedRefreshToken = await bcryptjs.hash(refreshToken, 10);
      user.refreshToken.push(hashedRefreshToken);
      await user.save();

      res.cookie("userToken", accessToken, { httpOnly: true });
      res.cookie("refreshToken", refreshToken, { httpOnly: true });

      return res.redirect("/dashboard");
    } catch (err) {
      console.log(err);
      return res.redirect("/login/view");
    }
  }

  async handleRefreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.redirect("/login/view");

      let decoded;
      try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
      } catch (err) {
        return res.redirect("/login/view");
      }

      const user = await User.findById(decoded.id);
      if (!user || !user.refreshToken || user.refreshToken.length === 0) {
        return res.redirect("/login/view");
      }

      let isValidToken = false;
      for (const hashedToken of user.refreshToken) {
        const isMatch = await bcryptjs.compare(refreshToken, hashedToken);
        if (isMatch) {
          isValidToken = true;
          break;
        }
      }

      if (!isValidToken) return res.redirect("/login/view");

      const newAccessToken = jwt.sign(
        { id: user._id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" },
      );

      res.cookie("userToken", newAccessToken, { httpOnly: true });
      return res.redirect("/dashboard");
    } catch (err) {
      console.log(err);
      res.redirect("/login/view");
    }
  }

  async logout(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.clearCookie("userToken");
        res.clearCookie("refreshToken");
        return res.redirect("/login/view");
      }

      let decoded;
      try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
      } catch (err) {
        res.clearCookie("userToken");
        res.clearCookie("refreshToken");
        return res.redirect("/login/view");
      }

      const user = await User.findById(decoded.id);
      if (user && user.refreshToken && user.refreshToken.length > 0) {
        let matchedToken = null;
        for (const hashedToken of user.refreshToken) {
          const isMatch = await bcryptjs.compare(refreshToken, hashedToken);
          if (isMatch) {
            matchedToken = hashedToken;
            break;
          }
        }

        if (matchedToken) {
          user.refreshToken = user.refreshToken.filter(
            (token) => token !== matchedToken,
          );
          await user.save();
        }
      }

      res.clearCookie("userToken");
      res.clearCookie("refreshToken");
      return res.redirect("/login/view");
    } catch (err) {
      console.log(err);
      res.clearCookie("userToken");
      res.clearCookie("refreshToken");
      return res.redirect("/login/view");
    }
  }
}

module.exports = new userAuthController();
