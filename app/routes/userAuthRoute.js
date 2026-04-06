const userAuthController = require("../controllers/userAuthController");

const express = require("express");
const Router = express.Router();

Router.get("/register/view", userAuthController.registerView);
Router.post("/register/create", userAuthController.registerCreate);

Router.get("/login/view", userAuthController.loginView);
Router.post("/login/create", userAuthController.loginCreate);
Router.get("/logout", userAuthController.logout);

module.exports = Router;
