const { menus ,inboxes} = require('../models');
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
  
  async createMenu(req, res, next){
    try {
      const isCompanyHasMenu = await menus.findOne({companyid:req.body.companyid});
      if(isCompanyHasMenu){
       res.status().json({
          message: 'You Already Has Menu'
        })  
      }else{
        try{
          const createMenu = await req.body.questionsandanswer.map((answers) => {
            menus.create({
              questions:answers.question,
              answers:answers.answer,
              questionorder:answers.questionorder,
              companyid:answers.companyid,
              })
            })  
            return res.status(201).json({
              message: 'Your Menu Created Successfully'
            })  
      }catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
      }
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }, 

  async getAllCompanyInboxes(req, res, next) {
    const  companyPhone      = req.body.companyphone;
    try {
      const messages = await inboxes.findAll({
        attributes: ['id', 'companyid', 'incomingmessages', 'senderohone', 'status'],
        where: { companyid:companyPhone},
      });
      res
        .status(200)
        .json(messages);
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  } 


};
