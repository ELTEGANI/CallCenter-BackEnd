const { menus ,inboxes,companies} = require('../models');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const {postMenu,postReplay} = require('../utiltes/sendtosmsgateway');
require('dotenv').config();


module.exports = {
  async signUpCompany(req, res, next) {
    const  companyPhone  = req.body.companyPhone;
    const  companyName  = req.body.companyName;
    const  password  = Math.random().toString(4).substring(2,5) + Math.random().toString(4).substring(2,5)
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
          meesage:"Company Registered Successfully",
          password:password
        })
        //send password to smsgateway
        console.log(password);
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
     try {
      const isCompanyHasMenu = await menus.findOne({ where: {companyid:req.body.companyid}});
      if(isCompanyHasMenu){
        res.status(200).json({
          message: 'You Already Has Menu'
        })     
      }else{
        try{
          await Promise.all( 
            req.body.questionsandanswer.map(async (answers) => {
              const createMenu = await menus.create({
                questions:answers.question,
                answers:answers.answer,
                questionorder:answers.questionorder,
                companyid:answers.companyid,
                })
                console.log(createMenu)
              }) 
              );
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
        where: { companyid:companyphone,status:"false"},
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
          attributes: ['questionorder','questions'],
          where:{companyid:companyPhone}
        });
        if(companyMenu){
        //post menu to sms gateway
        // const sendMsgToSmsGateWay = await postMenu(companyMenu) 
        // console.log(sendMsgToSmsGateWay);
        res.status(200).json({companyMenu})
        }
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
            if(answer){
            //post menu to sms gateway
            // const sendMsgToSmsGateWay = await postMenu(answer) 
            // console.log(sendMsgToSmsGateWay);
            res.status(200).json({answer:answer})
            }
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
          status:"false"}
          );
          if(saveMsg){
            // const feedBackToUSer = "تم استعلامك وسيتم الرد عليك قريبا";
            // const sendMsgToSmsGateWay = await postMenu(feedBackToUSer) 
            // console.log(sendMsgToSmsGateWay);   
            res.status(201).json({message: "Ok"}) 
          }
         
    }catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
},


  // async sendReplyToUser(req, res, next) {
  //   const companyPhone = req.body.companyPhone;
  //   const userPhone = req.body.userPhone;
  //   const replayContent = req.body.replayContent;

  //   //send admin feedback to user
  //   let sendReplayToUser = {companyPhone:companyPhone,userPhone:userPhone,replay:replayContent};
  //   const sendMsgToSmsGateWay = await postReplay(JSON.stringify(sendReplayToUser)); 
  //   console.log(sendMsgToSmsGateWay);
  //   try{
  //     if(sendMsgToSmsGateWay){
  //       const updatedInboxes = await inboxes.update({
  //         status:"true"
  //       }, { where: { companyid: companyPhone } });
  //       console.log(updatedInboxes);
  //       res.status(200).json({message: "Replyed Done"}) 
  //     }
  //   }catch (err) {
  //     if (!err.statusCode) {
  //       err.statusCode = 500;
  //     }
  //     next(err);
  //   }
  // }

};
