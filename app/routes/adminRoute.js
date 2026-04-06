const AdminController = require('../controllers/adminController');
const {authCheck,authorize}= require('../middleware/checkAuth');

const express = require('express');
const Router = express.Router();
Router.get('/admin/users', authCheck,authorize('SuperAdmin', 'Admin'), AdminController.listUsers);
Router.post('/admin/users/add',authCheck, authorize('SuperAdmin'), AdminController.addUser); 
Router.get('/admin/users/toggle/:id',authCheck, authorize('SuperAdmin', 'Admin'), AdminController.toggleStatus);
Router.get('/admin/users/delete/:id',authCheck, authorize('SuperAdmin', 'Admin'), AdminController.deleteUser);
Router.get('/admin/users/edit/:id', authCheck, authorize('SuperAdmin', 'Admin'), AdminController.editUser);
Router.post('/admin/users/edit/:id', authCheck, authorize('SuperAdmin', 'Admin'), AdminController.updateUser);

module.exports = Router