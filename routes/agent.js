var express = require('express');
var app =express();
var router = express.Router();
let agent = require('../model/agent');
const TokenAgent = require('../model/TokenAgent');
const tokenModel = require('../model/token')
const loginModel = require('../model/login')
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt')
var date = new Date();

var RandomString = function(){
    var strLength = 20
    if(strLength){
        var possibleChar = 'abcdefghiklmnopqrstuvwxyz0123456789'
        var str = ''
        for(i = 1;i<=strLength; i++){
            var randomChar = possibleChar.charAt(Math.floor(Math.random() * possibleChar.length))
            str += randomChar
        }
        return str
    }
    else{
        console.log(' string error')
    }
}
router.post('/add',async(req,res)=>{
    console.log(req.body)
    var token_id = RandomString()

    var d   ;
    var Admin_Token = req.body.Admin_Token;
    var findEmail =  await tokenModel.findOne({tokenId:Admin_Token})
 
    var Admin_Email = findEmail['Admin_Email']
   
    var check = TokenAgent.findOne({Agent_Email:req.body.Agent_Email});
  
    check.exec((err,data)=>{
        if(err){
            console.log('Error 1....')
             }
        if(data){
            d = 'y1'                                                                                                                                                                                   
           res.json({"msg":"already"})
        }   
        else{

              //    Nodemail
           var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'saifullahyasir17@gmail.com',
              pass: ''
            }
          });
          
          var mailOptions = {
            from: 'saifullahyasir17@gmail.com',
            to: req.body.Agent_Email,
            subject: 'Sending Email from ChatFlicker',
            text: 'http://localhost:4200/verifyAgent/' +token_id
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            }
            else{
               
              var v_task = new TokenAgent({
                tokenId : token_id,
                Agent_Email:req.body.Agent_Email,
                Agent_Name:req.body.Agent_Name,
                Role:req.body.role,
                Admin_Email:Admin_Email,
            }); 
               var task = new tokenModel({
                    tokenId : token_id,
                    Admin_Email :req.body.Agent_Email,
                    expire:date.setDate(date.getDate()+20)
               });
            if(task.save() && v_task.save()){
             res.json({"msg":"ok"})
             console.log('send ')
            }
            else{
              console.log('Not Send Link')
            }
            }
          });    
        }                                                                                                                      
    })

    // var task = new agent({
    //     name:req.body.name,
    //     email:req.body.email,
    //     role:req.body.role,
    //     admin_email:req.body.admin_email,

    // })
    // if(task.save()){
    //     console.log('agent save')
    //     res.send('agent save')
    // }
    // else{

    //     console.log('agent not save')
    //     res.send('agent not save')
    // }
})
 
router.post('/addagent',async (req,res)=>{
    console.log(req.body)
    var token = req.body.token;

   var findToken = await TokenAgent.findOne({tokenId:token})
   console.log(findToken)
   pass = bcrypt.hashSync(req.body.Agent_Pass,16);

   var Agent_Email = findToken['Agent_Email']
   var Agent_Name = findToken['Agent_Name']
   var Role = findToken['Role']
   var Admin_Email = findToken['Admin_Email']
    console.log(Admin_Email)
   if(Role =='Admin'){

   }
   else if(Role = 'Manager'){

   }
   else if(Role = 'Agent'){

   }
   else{

   }    
    var task = new agent({
        Agent_Email:Agent_Email,
        Agent_Name:Agent_Name,
        Role:Role,
        Admin_Email:Admin_Email,
        password:pass
    })
    var loginTask = new loginModel({
        Admin_Email:Agent_Email,
        Admin_Password:pass,
        User_type:3,
        status:0

    })
    if(task.save() && loginTask.save()){
        console.log('agent save')
        res.json({"message":"Agent save"})
    }
    else{

        console.log('agent not save')
        res.send('agent not save')
    }

})

router.get('/show/:token', async (req,res)=>{
    var tk = req.params.token;
    var tk_find = await tokenModel.findOne({tokenId:tk})
    var tk_email = tk_find['Admin_Email']; 
    var task = await agent.find({}).where('Admin_Email').equals(tk_email);
    if(task){
        res.send(task)
    }
    else{
        res.send('not found')
    }
})
router.delete('/delete/:id',(req,res)=>{
    var del =   agent.findByIdAndDelete(req.params.id);
    del.exec((err,data)=>{
        if(!err){
            res.send('deleted')
            console.log('deleted')
        }
        else{
            
            res.send('not deleted')
            console.log(' not deleted')
        }
    })
})

module.exports = router
