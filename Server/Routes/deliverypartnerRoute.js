const express = require('express');
const deliveryPartnerController=require("../Controllers/deliveryPartnerController");

const deliveryPartner = express.Router()

deliveryPartner.post('/signUp',deliveryPartnerController.signUp);
deliveryPartner.post('/login',deliveryPartnerController.login);
deliveryPartner.get('/getdeliveryData',deliveryPartnerController.getdeliveryData);
deliveryPartner.patch('/acceptOrder',deliveryPartnerController.acceptingOrder);
deliveryPartner.patch('/rejectingOrder',deliveryPartnerController.rejectingOrder);


module.exports = deliveryPartner;