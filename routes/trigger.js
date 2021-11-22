var express = require('express');
var app =express();
let trigger = require('../model/trigger')
var router = express.Router();
var chatModel = require('../model/chat')
var StringDecoder = require('string_decoder').StringDecoder
var geoip = require('geoip-lite');
const { Navigator } = require("node-navigator");
const navigator = new Navigator();
const token = require('../model/token');
router.post('/add',async(req,res)=>{
    console.log(req.header('User-Agent'))
    var q = req.header('User-Agent')
    console.log( q.match(/chrome\/([\d.]+)/))

var decoder = new StringDecoder('utf-8');
var buffer = ''
   var tk = req.body.admin_token;
   var tk_find = await token.findOne({tokenId:tk})
   var tk_email = tk_find['Admin_Email']; 
    var task = new trigger({
       name:req.body.tr_name,
       description:req.body.tr_description,
       admin_email:req.body.admin_email,
       admin_id:tk_email 
    }) 
    var ip = require("ip");
    console.log('ip address',ip.address());
    // console.log('Headers: ' + JSON.stringify(req.headers));
    console.log('IP: ' + JSON.stringify(req.ip));

    // var geo = geoip.lookup(ip.address());

    // console.log("Browser: " + req.headers["user-agent"]);
    // console.log("Language: " + req.headers["accept-language"]);
    // console.log("Country: " + (geo ? geo.country: "Unknown"));
    // console.log("Region: " + (geo ? geo.region: "Unknown"));

    // console.log('geo',geo);

    // res.status(200);
    // res.header("Content-Type",'application/json');
    // res.end(JSON.stringify({status: "OK"}));
 
    if(task.save()){
        console.log('trigger')
        res.send('task save')
    }
    else{
        console.log('task not save ')
    }

})
router.get('/',async (req,res)=>{
    
    
    var task = await trigger.find({});
   
       
        if(task){
            res.send(task)
        }
        else{
            res.send('not found')
        }
       
})
router.get('/:email',async (req,res)=>{


    var task = await trigger.find({admin_email:req.params.email});
    if(task){
        res.send(task)
    }
    else{
        res.send('not found')
    }
})
router.delete('/delete/:id',(req,res)=>{
    var del =  trigger.findByIdAndDelete(req.params.id)
    del.exec((err,data)=>{
        if(!err){
            console.log('delete')
        }
        else{
            console.log('not delete')
        }
    })
})

router.post('/trgmsg',async(req,res)=>{
    var tk = req.body.admin_token;
   var tk_find = await token.findOne({tokenId:tk})
   var tk_email = tk_find['Admin_Email']; 
    var task = chatModel.findOneAndUpdate({adminemail:tk_email},{$push:{msg:[{admin_msg:req.body.adminmsg}]}})
    var task1 = chatModel.updateMany({adminemail:tk_email},{$push:{msg:[{admin_msg:req.body.adminmsg}]}})
    if(task1.exec()){
        console.log(req.body)
        console.log('trigger send')
        res.send('trigger send')
    }
    else{
        console.log('trigger not send')
    }

})
module.exports = router