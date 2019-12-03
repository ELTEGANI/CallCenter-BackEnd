const { menus ,inboxes,companies} = require('../models');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = {
  async signUpCompany(req, res, next) {
    const  companyPhone  = req.body.companyPhone;
    const  companyName  = req.body.companyName;
    const  password  = req.body.password;
    const  bussinessType  = req.body.bussinessType;
    const  ownerPhone  = req.body.ownerPhone;
    const  ownerName  = req.body.ownerName;
    const  ownerEmail  = req.body.ownerEmail;
  
    try{
      const isCompanyExists = await companies.findOne({ where: { companyPhone:companyPhone } })
      if(isCompanyExists){
        const error = new Error('This company already Exists');
        error.statusCode = 401;
        throw error;
      }else{
      const hashedPassword = await bcrypt.hash(password,12)  
      const result = await companies.create({
        companyPhone:companyPhone,
        companyName:companyName,
        password:hashedPassword,
        bussinessType:bussinessType,
        ownerName:ownerName,
        ownerPhone:ownerPhone,
        ownerEmail:ownerEmail,
        })
         res
        .status(201)
        .json({
          meesage:"Company Registered Successfully"
        })
      }
    }catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  },  

  async loginCompany(req, res, next) {
    const  companyPhone  = req.body.companyPhone;
    const  password  = req.body.password;
    try{
    const isCompanyFound = await companies.findOne({ where: {companyPhone:companyPhone}});
    if(!isCompanyFound){
          const error = new Error('Company With This Phone Couldnt Be Found');
          error.statusCode = 401;
          throw error;    
    }else{
      const isPasswordEquel = await bcrypt.compare(password,isCompanyFound.password);
      if(!isPasswordEquel){
        const error = new Error('Worng Password');
        error.statusCode = 401;
        throw error;
      }else{
        const token = jwt.sign({companyId:isCompanyFound.id},process.env.JWT_SEC);
      res.status(200).json({
        accesstoken:token,
        companyPhone:isCompanyFound.companyPhone,
        companyName:isCompanyFound.companyName,
        ownerName:isCompanyFound.ownerName,
        ownerPhone:isCompanyFound.ownerPhone,
        ownerEmail:isCompanyFound.ownerEmail,
      })
      }
    }  
    }catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  
  async createMenu(req, res, next){
    console.log(req.body);
    try {
      const isCompanyHasMenu = await menus.findOne({ where: {companyid:req.body.companyid}});
      if(isCompanyHasMenu){
        res.status(200).json({
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
           res.status(201).json({
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
    console.log(req.body.companyPhone)
    const  companyphone      = req.body.companyPhone;
    try {
      const messages = await inboxes.findAll({
        attributes: ['id', 'companyid', 'incomingMessages', 'senderPhone', 'status'],
        where: { companyid:companyphone},
      });
      res
        .status(200)
        .json({companyMessages:messages});
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }, 



  async getMenuOrOptions(req, res, next){
    const companyPhone = req.body.companyPhone;
    const senderPhone = req.body.senderPhone;
    const messageContent = req.body.messageContent;
   
    if(messageContent === "*"){
      try{
        const companyMenu = await menus.findAll({
          attributes: ['questionorder','answers'],
          where:{companyid:companyPhone}
        });
        //  let menu = companyMenu.map((element) => {
        //   return element.questionorder+' '+element.answers; 
        //  });
        //  res.status(200).json(menu)
          res.status(200).json({menu:companyMenu})

      }catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    }

   else if (!isNaN(messageContent)){
          try{
            const answer = await menus.findAll({
              attributes: ['answers'],
              where:{questionorder:messageContent}
            });
            res.status(200).json({answer:answer})
          }catch (err) {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
          }
  }
   
  else{
    try{
      const saveMsg = await inboxes.create({
          companyid:companyPhone,
          incomingMessages:messageContent,
          senderPhone:senderPhone,
          status:"false",
          })  
       res.status(201).json({
          message: "Ok"
        }) 
    }catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
  },
  async sendReplyToUser(req, res, next) {
    const companyPhone = req.body.companyPhone;
    const userPhone = req.body.userPhone;
    const replayContent = req.body.replayContent;
    
   
  }

};
