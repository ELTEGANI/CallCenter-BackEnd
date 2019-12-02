const express = require('express');
const { body } = require('express-validator/check');
const companyController = require('../controllers/companyController');
const router = express.Router();
const isAuth = require('../authenticationMiddleware/middleware');




router.post('/registercompany',companyController.signUpCompany);
router.post('/logincompany',companyController.loginCompany);
router.post('/createmenu',companyController.createMenu);
router.get('/getallmessages',companyController.getAllCompanyInboxes);


module.exports = router;