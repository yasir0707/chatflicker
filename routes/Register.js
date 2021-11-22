var express = require('express');
var nodemailer = require('nodemailer');
var app =express();
var router = express.Router();
var regModel = require('../model/register')
var logModel = require('../model/login')
var tokenModel = require('../model/token')
var verifyModel = require('../model/verify')
var bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var date = new Date();
// jsonweb Token 

function checkEmail(req,res,next){
        var email = req.body.Admin_Email;
        var check = regModel.findOne({Admin_Email:email});

        check.exec((err,data)=>{
            if(err){
                console.log('Error 1....')
            }
            if(data){
              return console.log('Already exit')
            }
            next()
        })
}

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
router.post("/",(req,res)=>{
var d  ;
    var email = req.body.Admin_Email;
    var check = regModel.findOne({Admin_Email:email});

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
          
var random_numb = Math.floor(Math.random() * (10000 - 6000 + 1) + 6000)
          var mailOptions = {
            from: 'saifullahyasir17@gmail.com',
            to: req.body.Admin_Email,
            subject: 'Sending Email from ChatFlicker',
            text: '<b> Verification Code is <b>' +random_numb
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
          
              var v_task = new verifyModel({
                code : random_numb,
                admin_email:req.body.Admin_Email
            }) 
            if(v_task.save()){
             res.json({"msg":"ok"})
            }
            else{
  
              console.log('Not Send Code')
            }
            }
          });    
        }                                                                                                                      
    })
  
})

router.post("/add/:code",async(req,res)=>{
  var data;
    var code =req.params.code
 

  var t1 = await verifyModel.find({});

  var t2 =  await t1.find((r)=> r.admin_email == req.body.Admin_Email && r.code == code); 
  if(t2){

    pass = bcrypt.hashSync(req.body.Admin_Password,16);

      const task = new regModel({
        Admin_Name:req.body.Admin_Name,
        Admin_Company:req.body.Admin_Company,
        Admin_Email:req.body.Admin_Email,
        Admin_Number:req.body.Admin_Number,
        Admin_Password:pass,
        Join_Date: date.toLocaleDateString()
    })
    const Logintask = new logModel({
        Admin_Email:req.body.Admin_Email,
        Admin_Password:pass,
        User_type:'2',
    })
    const tokentask = new tokenModel({
        tokenId : RandomString(),
        Admin_Email : req.body.Admin_Email,
        expire: date.setDate(date.getDate()+20)

    })
    if(task.save() && Logintask.save() && tokentask.save()){
        res.json({"msg":"add"})
        console.log('Admin Task Post')
    }
    else{
      res.json({"msg":"not"})
      console.log('Admin Task Post Failed')  
    }
  }
  else{
        res.json({"msg":"not matched"})
  }
})
router.get('/',async (req,res)=>{
    try{
        const task =await regModel.find({});
        if(task){
            res.send(task)
            // console.log('Admin get..')
        }
        else{
            console.error('Admin get Error');
        }
    }
    catch(error){ 
        throw error;
    }
})
// router.get('/:email',async (req,res)=>{
//   const task = await regModel.find().where('Admin_Email').equals(req.params.email);
//   if(task){
//     res.send(task)
//   }
//   else{

//   }
  
// })
// Update
router.post("/update/:id",(req,res)=>{
    var id = req.params.id;
    const task =regModel.findByIdAndUpdate(id,{
        Admin_Name:req.body.Admin_Name,
        Admin_Company:req.body.Admin_Company,
        Admin_Email:req.body.Admin_Email,
        Admin_Number:req.body.Admin_Number,
        Admin_Password:req.body.Admin_Password
    })
    if(task.exec()){
        res.json({message:"Admin Update Post"})
        console.log('Admin Task Update Post')


    }
    else{
        res.json({message:"Admin update Failed"})
        console.log('Admin Task Post update Failed')  
    }
})

// Delete
router.delete('/delete/:id',(req,res)=>{
    var id = req.params.id;
    var del = regModel.findByIdAndDelete(id);
    del.exec((err,data)=>{
        if(!err){
            console.log('Admin delete')
        }else{
            console.log('Admin Not delete')
        }
    })
})

// Login Status
router.post("/login/status", (req,res)=>{
   
    var task =  logModel.updateOne({
        Admin_Email:req.body.Admin_Email
    },{
        $set:{
            status:req.body.status
        }
    })
    if(task.exec()){
      
    }
    else{
        console.log('status error')
    }
})
// Get Status
router.get('/login/GetStatus/:email',async(req,res)=>{

    var email = req.params.email
    var task = await logModel.findOne({Admin_Email:email});

    if(task){
        res.send(task)

    }else{
        console.log('not found1 ')
    }

})

// Login
router.get("/login/:token",async(req,res)=>{
    var tk = req.params.token;  
    var tk_find = await tokenModel.findOne({tokenId:tk})
    var tk_email = tk_find['Admin_Email']; 
    var task = await logModel.findOne({Admin_Email:tk_email});
    if(task){
        res.json({'msg':task['User_type']})
    }
    else{
        console.log('log error')
    }
})
router.get("/logins",async(req,res)=>{
  var task = await logModel.find({});
  if(task){
      res.send(task)
     }
  else{
      console.log('log error')
  }
})

router.post("/login",async (req,res)=>{
    

    // try{
    const email = req.body.Admin_Email;
    const pass = req.body.Admin_Password;
    // console.log(email + ""+ pass) 
    var findtoken =  await tokenModel.findOne({Admin_Email:email})

    // console.log(findtoken['tokenId'])

    const useremail = await logModel.findOne({Admin_Email:email})
  
    if(useremail){    
        var findtoken =  await tokenModel.findOne({Admin_Email:email})

            const passwordMatch  = await  bcrypt.compare(pass ,useremail.Admin_Password); 
            if(passwordMatch){
                res.json({"token":findtoken['tokenId']})
                // res.status(200).json({"token":findtoken['tokenId']})
                console.log('login success')
            }
            else{
                if(res.status== 200){
                    
                    res.json({message:"Invalid Password Detail"})
                    console.log('failed')
                }else{
                   
                    res.json({'message':"Invalid Password Detail"})
                    
                    console.log('login failed')
                }
            }
        
    

  
}
else{
    res.json({'message':"Email not found"})
}
// }
// catch(error){
//     console.log('login error')
// }

    // var check_login = regModel.findOne({Admin_Email:req.body.Admin_Email});
    // if(check_login){
    //     check_login.exec((err,data)=>{
    //         if (err) {
    //             console.log('Email error')
    //         }
    //         else{
    //             var getPas = data.Admin_Password;
    //             if(bcrypt.compareSync(req.body.Admin_Password,getPas)){
    //                 console.log('login success')
    //             }
    //             else{
    //                 console.log('login failed')
    //             }
        
    //         }
    //         }) 
    // }
    // else{
    //     console.log('Email failed')
    // }
 
    
})

// Forget
router.post('/forget',async (req,res)=>{
    console.log(req.body)
    var email = req.body.Admin_Email;
    const useremail = await logModel.findOne({Admin_Email:email})
    

    if(useremail){
                      //    Nodemail
           var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'saifullahyasir17@gmail.com',
              pass: ''
            }
          });
var random_numb = Math.floor(Math.random() * (10000 - 6000 + 1) + 6000)
var mailOptions = {
  from: 'saifullahyasir17@gmail.com',
  to: req.body.Admin_Email,
  subject: 'Sending Email from ChatFlicker',
  text: ' Verification Code is ' +random_numb
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
    var v_task = new verifyModel({
      code : random_numb,
      admin_email:req.body.Admin_Email
  }) 
  if(v_task.save()){
      res.send({"msg":"ok"})
    console.log('Send Code')
  }
  else{
    res.status(400).send({"msg":"fail"})
    console.log('Not Send Code')
  }
  }
});    

    }
    else{
        res.json({"message":"User not found"})
      console.log('user not found')
      }
})
// Password Update
router.post('/u_verify', async (req,res)=>{

  
    var t1 = await verifyModel.find({});
  
    var t2 =  await t1.find((r)=> r.admin_email == req.body.Admin_Email && r.code == req.body.code); 
    if(t2){
      console.log('yes')
      res.json({"msg":"ok"})  
    }
    else{
      res.json({"msg":"fail"})  
      console.log('not matched')
    }
})
router.post('/u_pass', async (req,res)=>{

   
  
    pass = bcrypt.hashSync(req.body.Admin_Password,16);
  
        const task = regModel.findOneAndUpdate({Admin_Email:req.body.Admin_Email},{
         
          Admin_Password:pass
      })
      const Logintask = logModel.findOneAndUpdate({Admin_Email:req.body.Admin_Email},{
          
          Admin_Password:pass,
          User_type:'2',
      })
      if(task.exec() && Logintask.exec()){
        
        res.json({"message":"Admin Password Update"})
          console.log("Admin Password Update")
      
        }
      else{
       
        res.json({"message":"Admin Password Not Update"})
        console.log("Admin Password Update")
      }
 
})
module.exports= router
