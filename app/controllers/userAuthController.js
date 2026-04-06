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
      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" },
      );

      res.cookie("userToken", token);

      if (user) {
        return res.redirect("/dashboard");
      }
      return res.redirect("/login/view");
    } catch (err) {
      console.log(err);
      return res.redirect("/login/view");
    }
  }

  async logout(req, res) {
    res.clearCookie("userToken");
    return res.redirect("/login/view");
  }
}
module.exports = new userAuthController();
