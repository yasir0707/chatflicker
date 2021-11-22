var express = require('express');
var nodemailer = require('nodemailer');
var app =express();
var router = express.Router();
var userModel = require('../model/user')
var addressModel = require('../model/address');



router.post("/:email",(req,res)=>{

    const admin_email = req.params.email
     const task = new userModel({
        id:req.body.getid,
        browserid:req.body.browserid,
        admin_email:admin_email,
        user_email:req.body.useremail,
        user_name:req.body.username,
        user_message:req.body.usermsg

    })
    if(task.save()){
        res.json({message:"User Post"})
        console.log('User Task Post')

    }
    else{
        res.json({message:"User Failed"})
        console.log('User Task Post Failed')  

    }
})
router.get('/',async (req,res)=>{
    try{
        const task =await userModel.find({});
        if(task){
            res.send(task)
            // console.log('user get..')
        }
        else{
            console.error('Uset get Error');
        }
    }
    catch(error){ 
        throw error;
    }
})
//  Delete
router.delete('/delete/:id',(req,res)=>{
    var id = req.params.id;
    var del = userModel.findByIdAndDelete(id);
    del.exec((err,data)=>{
        if(!err){
            console.log('User  delete')
        }else{
            console.log('User Not delete')
        }
    })
})
router.post('/address/loc',(req,res)=>{
    const task = new addressModel({
        adminemial:req.body.admin_email,
        useremail:req.body.user_email,
        userip:req.body.user_ip,
        user_lat:req.body.user_lat,
        user_lng:req.body.user_lng,
        user_city:req.body.user_city,
        user_state:req.body.user_state,
        user_country:req.body.user_country
    })
    if(task.save()){
        console.log('Address save')
    }
    else{
        console.log('Addres not save');
    }
})


router.get('/getaddress',async (req,res)=>{
        const task = await addressModel.find({});
        if(task){
            res.send(task)
        }
        else{
            console.log("not found")
        }
})
router.get('/getaddress/:adminemail',async (req,res)=>{
    const task = await addressModel.find().where('adminemial').equals(req.params.adminemail);
    if(task){
        res.send(task)
    }
    else{
        console.log("not found")
    }
})
module.exports = router