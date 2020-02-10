const express = require('express');
const companyController = require('../controllers/companyController');
const router = express.Router();
const isAuth = require('../authenticationMiddleware/middleware');
const isUserAuth = require('../authenticationMiddleware/usermiddleware');

   


router.post('/registercompany',companyController.signUpCompany);
router.post('/logincompany',companyController.loginCompany);
router.post('/createmenu',isAuth,companyController.createMenu);
router.post('/getallmessages',isAuth,companyController.getAllCompanyInboxes);
router.post('/displaymenuandoptions',companyController.getMenuOrOptions);
router.post('/statistic',isAuth,companyController.showStatistic);
router.post('/getmenus',isAuth,companyController.getMenu);
router.post('/updatemenus',isAuth,companyController.updateMenu);
router.post('/deletecell',companyController.deleteSms);
router.post('/getallsms',companyController.getAllSms);
router.post('/sendReplayToUser',companyController.sendReplyToUser);
router.post('/registeruser',companyController.signUpUser);
router.post('/getMenuOrOptionsforuser',isUserAuth,companyController.getMenuOrOptionsforuser);


module.exports = router;
  