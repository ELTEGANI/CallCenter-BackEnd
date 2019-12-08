const request = require('supertest');
const jwt = require('jsonwebtoken');
let server;
let token;

beforeEach(()=>{
  server = require('../../app');
   token = jwt.sign({ companyId: "56ce4520-199d-11ea-af9b-ade753f58537" }, process.env.JWT_SEC)  
});

afterEach(()=>{
    server.close();
})
  

test('should create new company account if company not found',async() => {
  const res = await request(server).post('/api/companies/registercompany')
  .send({
        companyPhone:"0999991230",
        companyName:"Nano Technology",
        bussinessType:"company",
        ownerPhone:"0999991230",
        ownerName:"Mohammed Ibrahim",
        ownerEmail:"moh@gmail.com",   
   })  
   expect(res.status).toBe(401);  
}); 


test('should not logedin user with incorrect credentials',async() => {
    const res = await request(server).post('/api/companies/logincompany').send({
        companyPhone: "0999991230",
        password: "wron passowed"  
     })  
     expect(res.status).toBe(401);  
  }); 


  test('should login user with correct credentials',async() => {
    const res = await request(server).post('/api/companies/logincompany').send({
        companyPhone: "0999991230",
        password: "032321"  
     })  
     expect(res.status).toBe(200);  
     expect(res.body).toMatchObject({
        companyPhone:"0999991230",
        companyName:"Nano Technology",
        ownerPhone:"0999991230",
        ownerName:"Mohammed Ibrahim",
        ownerEmail:"moh@gmail.com",  
     })
  }); 

  test('should not create menu for company without auth',async() => {
    const res = await request(server).post('/api/companies/createmenu').send(
        {
            questionsandanswer: 
                      [
                          {
                              question:"what are the zain services",
                              answer:"internet-mdsl-calls",
                              questionorder:"1",
                              companyid:"0999991230"
                              
                          }
                     ],
                     companyid:"0901589567"   
       }
     )  
     expect(res.status).toBe(401);  
  }); 

  test('should create menu for company with auth',async() => {
    const res = await request(server)
    .post('/api/companies/createmenu')
    .set('Authorization', `Bearer ${token}`)
    .send({questionsandanswer: 
                      [
                          {
                            questions:"what are the zain services",
                            answers:"internet-mdsl-calls",
                            questionorder:"1",
                            companyid:"0999991230"
                          },
                         {
                            questions:"what are the zain services",
                            answers:"internet-mdsl-calls",
                            questionorder:"2",
                            companyid:"0999991230"       
                          }
                     ],
                     companyid:"0999991230"   
       })  
     expect(res.status).toBe(201);  
  }); 

  test.todo("test for get all messages")
  test.todo("test for get menu options")