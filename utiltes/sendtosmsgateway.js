const axios = require('axios');


module.exports = {
    async postMenu(message){
        try{
          const smsGateWayResponse = await axios.post('url of sms gateway',message);
          if(smsGateWayResponse.status === 200){
              console.log(smsGateWayResponse);
              return smsGateWayResponse.data;
          }else{
              console.log(smsGateWayResponse);
              return null;
          }
        }catch(error){
         console.log(error);
        }
    },
    // async postReplay(message){
    //     try{
    //       const smsGateWayResponse = await axios.post('url of sms gateway',message);
    //       if(smsGateWayResponse.status === 200){
    //           console.log(smsGateWayResponse);
    //           return smsGateWayResponse.data;
    //       }else{
    //           console.log(smsGateWayResponse);
    //           return null;
    //       }
    //     }catch(error){
    //      console.log(error);
    //     }
    // }
}