const express = require('express');
const { body } = require('express-validator/check');
const companyController = require('../controllers/companyController');
const router = express.Router();
const isAuth = require('../authenticationMiddleware/middleware');




router.post('/registercompany', [
  body('companyPhone').trim().not().isEmpty(),
  body('companyName').trim().not().isEmpty(),
  body('numberType').trim().not().isEmpty(),
  body('simType').trim().not().isEmpty(),
  body('password').trim().not().isEmpty(),
  body('ownerPhone').trim().not().isEmpty()
],companyController.signUpCompany);

router.post('/logincompany',companyController.loginCompany);
router.post('/createmenu',companyController.createMenu);
router.get('/getallmessages',companyController.getAllCompanyInboxes);


module.exports = router;
