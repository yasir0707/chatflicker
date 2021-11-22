var express = require('express');
var app =express();
var router = express.Router();
let admin_role = require('../model/adminrole');
const adminrole = require('../model/adminrole');
const role = require('../model/role');
const token = require('../model/token');

router.post('/add',(req,res)=>{
    
    
    var task = new role({
        role_name:req.body.role_name
    })
    if(task.save()){
        console.log('role save')
        res.send('role save')
    }
    else{

        console.log('role not save')
        res.send('role not save')
    }
})

router.get('/show', async (req,res)=>{
    var task = await role.find({});
   
    if(task){
        res.send(task)
    }
    else{
        res.send('not found')
    }
 
})
router.delete('/delete/:id',(req,res)=>{
    var del =   role.findByIdAndDelete(req.params.id);
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
router.post('/admin_add',async(req,res)=>{
    var tk = req.body.admin_token;
    var tk_find = await token.findOne({tokenId:tk})
    var tk_email = tk_find['Admin_Email']; 
    var task = new admin_role({
        role_name:req.body.role_name,
        admin_email:tk_email
    })
    if(task.save()){
        console.log('role save')
        res.send('role save')
    }
    else{

        console.log('role not save')
        res.send('role not save')
    }
})

router.get('/admin_show/:email', async (req,res)=>{
    var tk =  req.params.email
 
    var tk_find = await token.findOne({tokenId:tk})
    var tk_email = tk_find['Admin_Email']; 
    var task = await admin_role.find().where('admin_email').equals(tk_email);
    if(task){
        res.send(task)
    }
    else{
        res.send('not found')
    }
})
router.get('/admin_show_role/:email', async (req,res)=>{
    var task = await role.find({});
    var tk =  req.params.email
    console.log(tk)
    var tk_find = await token.findOne({tokenId:tk})
    var tk_email = tk_find['Admin_Email']; 
    
    var task1 = await admin_role.find().where('admin_email').equals(tk_email);

   
    if(task || task1){
        var comb = task.concat(task1)
        res.send(comb)
    }
    else{
        res.send('not found')
    }
})
router.delete('/admin_delete/:id',(req,res)=>{
    var del =   admin_role.findByIdAndDelete(req.params.id);
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
module.exports =router