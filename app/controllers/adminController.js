const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const sendWelcomeEmail = require("../utils/sendmail");

class AdminController {
  async listUsers(req, res) {
    try {
      const users = await User.find({ _id: { $ne: req.user.id } });
      res.render("users/list", { users });
    } catch (error) {
      res.status(500).send("Error fetching users");
    }
  }

  async addUser(req, res) {
    try {
      const { name, email, role } = req.body;

      const existing = await User.findOne({ email });
      if (existing) return res.redirect("/admin/users");

      const generatedPassword = crypto.randomBytes(4).toString("hex");

      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(generatedPassword, salt);

      const user = new User({
        name,
        email,
        role,
        password: hashedPassword,
      });
      await user.save();

      await sendWelcomeEmail(user,generatedPassword);

      res.redirect("/admin/users");
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }

  async toggleStatus(req, res) {
    try {
      const user = await User.findById(req.params.id);
      user.isActive = !user.isActive;
      await user.save();
      res.redirect("/admin/users");
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }

  async deleteUser(req, res) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.redirect("/admin/users");
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
  async editUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      res.render("users/edit", { user });
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }

  async updateUser(req, res) {
    try {
      const { name, role } = req.body;
      await User.findByIdAndUpdate(req.params.id, { name, role });
      res.redirect("/admin/users");
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
}

module.exports = new AdminController();
