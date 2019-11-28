const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { Users, userExpenses } = require('../models');
require('dotenv').config();


module.exports = {
  async signUpCompany(req, res, next) {
    const  companyPhone  = req.body.companyPhone;
    const  companyName  = req.body.companyName;
    const  numberType  = req.body.numberType;
    const  simType  = req.body.simType;
    const  password  = req.body.password;
    const  ownerPhone  = req.body.ownerPhone;
  },  

  async loginCompany(req, res, next) {
    const  companyPhone  = req.body.companyPhone;
    const  password  = req.body.password;
  },
  
  async createMenu(req, res, next) {
    const  questions      = req.body.questions;
    const  answers        = req.body.answers;
    const  questionorder  = req.body.questionorder;
    const  companyid      = req.body.companyid;
  }, 

  async getAllCompanyInboxes(req, res, next) {
    const  companyPhone      = req.body.companyPhone;
  } 


};
