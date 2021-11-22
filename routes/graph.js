var express = require('express');
const graph = require('../model/graph');
var app =express();
var router = express.Router();
const visiter = require('../model/address')
var dt = new Date();




router.post("/add",async(req,res)=>{

    const visit = await visiter.findOne().where({})
        const addTask =  new graph({
            visit:req.body.visit,
            chat:req.body.chat,
            date: new Date().toISOString().slice(0,10),
            admin_token:req.body.token
        })
        if(addTask.save()){
            console.log('Add Task1')
            res.json({'msg':'Add task'})
        }
        else{  
            console.log('Not add Task')
            res.json({'msg':'Not Add task'})
        }
})
router.get('/show',async(req,res)=>{
    var showTask = await graph.find({});
    if(showTask){
        res.send(showTask)
    }
    else{
        res.json({'Error':'Not Found'})
    }
})

module.exports =  router 