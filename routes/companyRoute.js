const express = require('express');
const { body } = require('express-validator/check');
const companyController = require('../controllers/companyController');
const router = express.Router();




router.post('/registercompany', [
  body('companyPhone').trim().not().isEmpty(),
  body('companyName').trim().not().isEmpty(),
  body('numberType').trim().not().isEmpty(),
  body('simType').trim().not().isEmpty(),
  body('password').trim().not().isEmpty(),
  body('ownerPhone').trim().not().isEmpty()
],companyController.signUpCompany);

router.post('/logincompany', [
    body('companyPhone').trim().not().isEmpty(),
    body('password').trim().not().isEmpty(),
  ],companyController.loginCompany);

  router.post('/createmenu', [
    body('questions').trim().not().isEmpty(),
    body('answers').trim().not().isEmpty(),
    body('questionorder').trim().not().isEmpty(),
    body('companyid').trim().not().isEmpty(),
  ],companyController.createMenu);

  router.get('/getallmessages', [
    body('companyPhone').trim().not().isEmpty()
  ],companyController.getAllCompanyInboxes);


module.exports = router;
