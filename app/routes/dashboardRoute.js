const DashboardController = require("../controllers/dashboardController");
const {authCheck,authorize}= require('../middleware/checkAuth')

const express = require("express");
const Router = express.Router();

Router.get('/dashboard',authCheck, authorize('SuperAdmin', 'Admin', 'User'), DashboardController.getDashboard);

module.exports = Router;
