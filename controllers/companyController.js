const { menus ,inboxes,companies,Statistics,Users,replay} = require('../models');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const sequelize = require('sequelize');
const Fs = require('fs-extra')
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
    const  isCompanyVisible   = req.body.isVisible;
  
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
        isCompanyVisible:isCompanyVisible
        })
        if(result){
          res
        .status(201)
        .json({
          meesage:"Company Registered Successfully",
          password:password
        })
        //save data to file
        data = {
          "cellId":"4567",
          "userPhone":ownerPhone,
          "msgcontent":password
        }
        //retreve array from file
        try {
          const json = await Fs.readFile('data/data.json','utf8')
          const jsonArray = JSON.parse(json)
          jsonArray.push(data)
          //save data to file
           try {
          await Fs.writeFile('data/data.json',JSON.stringify(jsonArray))
          console.log('Saved data to file.')
        } catch (error) {
          console.error(error)
        }
        } catch (error) {
          console.log(error)
        }
        }
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
      console.log(isPasswordEquel);
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
       
        let orderedMenu = [];
        await Promise.all(
          companyMenu.map(async(item, i) => {
            orderedMenu.push(item.questionorder+'-'+item.questions)
          })
        )
         let finalMenu = {
           smsIndex:"1",
           smsPhoneNumber:companyPhone,
           smsReciver:senderPhone,
           smsContent:orderedMenu
         }
        if(companyMenu){
        res.status(200).json(finalMenu)
        }
      }catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
  }

   else if (!isNaN(messageContent)) {
     try{
      const createdStatistic = await Statistics.create({
        questionNumber:messageContent,
        companyNumber:companyPhone,
        })
        if(createdStatistic){
          try{
            const answer = await menus.findAll({
              attributes: ['answers'],
              where:{questionorder:messageContent}
            });

            let answers = '';
            await Promise.all(
              answer.map(async(item, i) => {
                answers += item.answers
              })
            )
             let finalAnswers = {
               smsIndex:"1",
               smsPhoneNumber:companyPhone,
               smsReciver:senderPhone,
               smsContent:answers
             }

            if(answer){
            res.status(200).json(finalAnswers)
            }
          }catch (err) {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
          }
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

          let finalAnswerInbox = {
            smsIndex:"1",
            smsPhoneNumber:companyPhone,
            smsReciver:senderPhone,
            smsContent:"Your Message Recieved"
          }

          if(saveMsg){
            res.status(201).json(finalAnswerInbox) 
          }
         
    }catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
},


  async showStatistic (req,res,next){
     const companyPhone = req.body.companyPhone;
     try{
        const calculatestatistic = await Statistics.findAll({
          attributes: [
            'questionNumber', 
            [sequelize.fn('COUNT',sequelize.col('questionNumber')), 'inqueries']
          ],
          where: { companyNumber:companyPhone },
          group: 'questionNumber',
          raw: true,  
          logging: true
        })
        res.status(200).json({Statistics:calculatestatistic}) 
     }catch (err) {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
   }
  },

  async getMenu (req,res,next){
    const companyPhone = req.body.companyPhone;
     try{
     const menu = await menus.findAll({   
      attributes: ['questionorder','questions','answers'],
      where:{companyid:companyPhone}
     })
     if(menu){
      res.status(200).json(menu)
      }
     }catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
  }
  },


  async updateMenu(req,res,next){
    const companyPhone = req.body.companyid;
    try{
      const deleted = await menus.destroy({ where: { companyid:companyPhone } });
      console.log(deleted)
      await Promise.all( 
        req.body.questionsandanswer.map(async (answers) => {
          const createMenu = await menus.create({
            questions:answers.questions,
            answers:answers.answers,
            questionorder:answers.questionorder,
            companyid:answers.companyid,
            })
          }) 
          );
       res.status(201).json({
          message: 'Your Menu Updated Successfully'
        })  
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },

  async deleteSms(req,res,next){
    const cellid = req.body.cellid;
    try {
      let json = await Fs.readFile('data/data.json','utf8')
      let jsonArray = JSON.parse(json)
      let arrayOfJson = jsonArray.filter((cellmsg) => { return cellmsg.cellId !== cellid });
      try {
       await Fs.writeFile('data/data.json',JSON.stringify(arrayOfJson,null, 2)) 
       res.status(200).json({
          message: 'data deleted successfuly'
        })  
      } catch (error) {
        console.error(error)
      }
    } catch (error) {
      console.log(error)
    }
  },

  async getAllSms(req,res,next){
    const cellid = req.body.cellid;
    try {
      let json = await Fs.readFile('data/data.json','utf8')
      let jsonArray = JSON.parse(json)
      let arrayOfJson = jsonArray.filter((cellmsg) => { return cellmsg.cellId == cellid });
      if(arrayOfJson){
        res.status(200).json(arrayOfJson)
      }
    } catch (error) {
      console.log(error)
    }
  },


   async sendReplyToUser(req, res, next) {
    const companyPhone = req.body.companyPhone;
    const userPhone = req.body.userPhone;
    const replayContent = req.body.replayContent;
    const cellId ="1002"
    
    try{
      const result = await replay.create({
        companyphone:companyPhone,
        companyreplay:replayContent,
        questionid:"1",
        userphone:userPhone
        })
        console.log(result);
    }catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
     //save data to file
     data = {
      "cellId":cellId,
      "userPhone":userPhone,
      "msgcontent":replayContent
      }
     //retreve array from file
     try {
      const json = await Fs.readFile('data/data.json','utf8')
      const jsonArray = JSON.parse(json)
      jsonArray.push(data)
      //save data to file
       try {
      await Fs.writeFile('data/data.json',JSON.stringify(jsonArray))
      res.status(200).json({
        message: 'Replay Saved successfuly'
      })  
      console.log('Saved data to file.')
    } catch (error) {
      console.error(error)
    }
    } catch (error) {
      console.log(error)
  }
},


async signUpUser(req, res, next) {
  const  phoneNumber      = req.body.phoneNumber;
  const  gender           = req.body.gender;
  const  age              = req.body.age;

   
    try{
      const user = await Users.findOne({ where: { phone_number:phoneNumber } });
      if (!user) {
          const result = await Users.create({
            phone_number:phoneNumber,
            gender:gender,
            age:age,
          });
          const token = jwt.sign({ userId: result.id }, process.env.JWT_SEC);
          res
            .status(201)
            .json({
              accessToken: token
            });
      
      } else {
          const token = jwt.sign({ userId: user.id }, process.env.JWT_SEC);
          res
            .status(200)
            .json({
              accessToken: token
            });
      }
    }catch(error){
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
},


async getMenuOrOptionsforuser(req, res, next){
  const companyPhone = req.body.companyPhone;
  const senderPhone = req.body.senderPhone;
  const messageContent = req.body.messageContent;
 
  if(messageContent === "*"){
    try{
      const companyMenu = await menus.findAll({
        attributes: ['questionorder','questions'],
        where:{companyid:companyPhone}
      });
     
      let orderedMenu = [];
      await Promise.all(
        companyMenu.map(async(item, i) => {
          orderedMenu.push(item.questionorder+'-'+item.questions)
        })
      )
      let finalMenu = {
        id:"1",
        text:orderedMenu.toString(),
        author:{
          id:"1",
          name:"Company",
          avatar:"image"
        },
        createdAt:new Date()
      }
      if(companyMenu){
      res.status(200).json(finalMenu)
      }
    }catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
}

 else if (!isNaN(messageContent)) {
   try{
    const createdStatistic = await Statistics.create({
      questionNumber:messageContent,
      companyNumber:companyPhone,
      })
      if(createdStatistic){
        try{
          const answer = await menus.findAll({
            attributes: ['answers'],
            where:{questionorder:messageContent,companyid:companyPhone}
          });

          let answers = '';
          await Promise.all(
            answer.map(async(item, i) => {
              answers += item.answers
            })
          )
           let finalAnswers = {
             id:"2",
             text:answers,
             author:{
               id:"1",
               name:"Company",
               avatar:"image"
             },
             createdAt:new Date()
           }

          if(answer){
          res.status(200).json(finalAnswers)
          }
        }catch (err) {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        }
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
        status:"false"
      });
        let finalAnswerInbox = {
          id:"2",
          text:"تم استلام رسالتك بنجاح",
          author:{
            id:"1",
            name:"Company",
            avatar:"image"
          },
          createdAt:new Date()
        }
        if(saveMsg){
          res.status(201).json(finalAnswerInbox) 
        }
       
  }catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
},

async showCompanyForUser(req, res, next) {
    const  phoneNumber      = req.body.companyPhone;

    try{
      const companyName = await companies.findAll({
        attributes: ['companyName'],
        where:{companyPhone:phoneNumber,isCompanyVisible:"true"}
      });
       if(companyName){
         res
        .status(200)
        .json(companyName)
      }
    }catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
},

async updateInboxStatus(req, res, next) {
  const  companyPhone      = req.body.companyPhone;
  const  userNumber      = req.body.userNumber;

  try{
    const updated = await inboxes.update({
      status:"true"
    }, { where: { senderPhone:userNumber,companyid:companyPhone} 
    });
    res 
      .status(200)
      .json({
        message: 'status Updated'
      });
  }catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

};
