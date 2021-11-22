var express = require('express');
var app =express();
var router = express.Router();
var link_model = require('../model/link')


router.post('/add',(req,res)=>{
    console.log(req.body)

    var task =new link_model({
        link:req.body.link,
        agent_name:req.body.name,
        admin_email:req.body.admin_email,
        id:req.body.id
    })
    if(task.save()){
        res.send('link save')
        console.log('link save')
    }
    else{
        res.send('link not save')
    }
})
router.get('/show',async (req,res)=>{
    var task = await link_model.find({})

    if(task){
        res.send(task)
    }
    else{
        res.send('not found')
    }
})

module.exports = router