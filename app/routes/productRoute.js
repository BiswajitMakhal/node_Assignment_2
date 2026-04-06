const ProductController = require('../controllers/productController');
const {authCheck,authorize}= require('../middleware/checkAuth');


const express = require('express');
const Router = express.Router();

Router.get('/products',authCheck, authorize('SuperAdmin', 'User'), ProductController.listProducts);
Router.post('/products/add',authCheck, authorize('SuperAdmin', 'User'), ProductController.addProduct);
Router.get('/products/delete/:id',authCheck, authorize('SuperAdmin', 'User'), ProductController.deleteProduct);

module.exports = Router;