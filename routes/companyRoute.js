const express = require('express');
const { body } = require('express-validator/check');
const companyController = require('../controllers/companyController');
const router = express.Router();
const isAuth = require('../authenticationMiddleware/middleware');

   


router.post('/registercompany',companyController.signUpCompany);
router.post('/logincompany',companyController.loginCompany);
router.post('/createmenu',isAuth,companyController.createMenu);
router.post('/getallmessages',isAuth,companyController.getAllCompanyInboxes);
router.get('/displaymenuandoptions',companyController.getMenuOrOptions);
router.post('/statistic',isAuth,companyController.showStatistic);
router.post('/getmenus',isAuth,companyController.getMenu);
router.post('/updatemenus',isAuth,companyController.updateMenu);
router.post('/deletecell',companyController.deleteSms);
router.get('/getallsms',companyController.getAllSms);
router.post('/sendReplayToUser',companyController.sendReplyToUser);


module.exports = router;
  