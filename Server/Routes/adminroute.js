const express = require('express');
const adminRouter = express.Router();
const adminController=require('../Controllers/adminController')
const multer=require('multer');

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });





adminRouter.post('/signup',adminController.signUp)
adminRouter.post('/login', adminController.loginAdmin);
adminRouter.post('/addFood',upload.single('photo'),adminController.addFood);
adminRouter.get('/getUserData',adminController.getUserData);
adminRouter.get('/getDeliveryPartnerData',adminController.getDeliveryPartnerData);
adminRouter.get('/viewActivity',adminController.viewActivity);
adminRouter.get('/deliveryPartnerViewActivity',adminController.deliveryPartnerViewActivity);
adminRouter.patch('/updateOrderStatus',adminController.updateOrderStatus);

module.exports = adminRouter;
