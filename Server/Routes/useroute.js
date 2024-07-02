const express = require('express');

const userController = require('../Controllers/userController')
const userRoute = express.Router()

userRoute.get('/getItems',userController.getItems);
userRoute.post('/signUp',userController.signUp);
userRoute.post('/login',userController.login);
userRoute.post('/orders',userController.orders);
userRoute.get('/getOrderedFoods',userController.getOrderedFoods)
userRoute.patch('/cancelOrder',userController.cancelOrder);

module.exports = userRoute;