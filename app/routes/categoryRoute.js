const CategoryController = require('../controllers/categoryController');
const {authCheck,authorize}= require('../middleware/checkAuth');


const express = require('express');
const Router = express.Router();

// Category:
Router.get('/categories', authCheck,authorize('SuperAdmin', 'Admin', 'User'), CategoryController.listCategories);
Router.post('/categories/add',authCheck, authorize('SuperAdmin', 'Admin', 'User'), CategoryController.addCategory);
Router.get('/categories/delete/:id',authCheck, authorize('SuperAdmin', 'Admin', 'User'), CategoryController.deleteNode);
Router.get('/categories/edit/:id', authCheck, authorize('SuperAdmin', 'Admin', 'User'), CategoryController.editCategory);
Router.post('/categories/edit/:id', authCheck, authorize('SuperAdmin', 'Admin', 'User'), CategoryController.updateCategory);

//SubCategory:
Router.get('/subcategories',authCheck, authorize('SuperAdmin', 'Admin', 'User'), CategoryController.listSubcategories);
Router.post('/subcategories/add',authCheck, authorize('SuperAdmin', 'Admin', 'User'), CategoryController.addSubcategory);
Router.get('/subcategories/edit/:id', authCheck, authorize('SuperAdmin', 'Admin', 'User'), CategoryController.editSubcategory);
Router.post('/subcategories/edit/:id', authCheck, authorize('SuperAdmin', 'Admin', 'User'), CategoryController.updateSubcategory);
Router.get('/subcategories/delete/:id', authCheck, authorize('SuperAdmin', 'Admin', 'User'), CategoryController.deleteNode); 

module.exports = Router