var express = require('express');
var app =express();
var router = express.Router();
var chatModel = require('../model/chat')
var multer = require('multer');
var path = require('path');
const fs = require('fs');
const seqModel  = require('../model/sequence');  
const chat = require('../model/chat');
const token = require('../model/token');

//  Sequence
router.post('/seq',(req,res)=>{
  var task = new seqModel({
    _id:"item_id",
    sequence_value:0
  })  
  if(task.save()){
    console.log('seq add')
  }
  else{
    console.log('seq error')
  }
})

function getnextSeq(SeqName){
    var SeqDoc = seqModel.findOneAndUpdate({
        query:{_id:SeqName},
        update:{$inc:{sequence_value:1}},
        new:true
    });
    return SeqDoc.sequence_value;
}

router.post('/read/:img',(req,res)=>{
    console.log('file',req.params.img)
    var imgName = req.params.img;
    
    
   
    filepath = path.join(__dirname,`../public/upload/${imgName}`)
    // console.log(filepath)
        res.json({"path":`D:/Angular/backend/public/upload/${imgName}`})
    // res.sendFile(path.resolve(`../backend/public/upload/${imgName}`),(err,data)=>{
    //     if(!err){
    //         console.log(data)
    //     }
    //     else{
    //         console.log('Image error',err)
    //     }
    // })
    // res.render(path.resolve(`../backend/public/upload/${imgName}`),(err,data)=>{
    //     res.send(data)
    //     console.log(data)
    // })

    // let f_data = fs.readFileSync(filepath)
    // res.json({'img':f_data});
    // console.log(f_data)
   
})
// app.use(__dirname,express.view())

// Image 
var Storag = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/upload')
    },
    filename:(req,file,cb)=>{
        cb(null, file.fieldname+'_'+Date.now()+file.originalname);
    }
});
var upload = multer({storage:Storag});

router.post('/',upload.single('file'),async (req,res)=>{
   
  
   var tk = req.body.admin_token;
   var tk_find = await token.findOne({tokenId:tk})
   var tk_email = tk_find['Admin_Email']; 


    // console.log('post chat')
  var srch; 
  var data;
    var imgName = req.file;
    // console.log(imgName.filename)
    // if(req.file.filename){
    // }
    // else{
    //     console.log('image not found')
    // }
 var task =  await chatModel.find({});
 if(task){
    data = task

}
 else{
    res.send('no chat found')
    
}
var t1 = await data.find((r)=> r.adminemail == tk_email && r.useremail == req.body.useremail) 
if(t1){
    res.send= t1
    srch = 'y'
}
else{
    res.send('not found 11')
    srch = 'n'
}
    if(srch == 'n'){
        var task = new chatModel({                 
                    adminid:req.body.adminid,
                    adminemail:tk_email, 
                    user_msg_status:req.body.user_msg_status,
                    admin_msg_status:req.body.admin_msg_status,
                    msg:[
                        {
                            admin_msg:  req.body.adminmsg,
                            user_msg:  req.body.usermsg
                        },
                     
                    ],
                    
                    userid:req.body.userid,
                    username:req.body.username,
                    useremail:req.body.useremail,
                   
                    time:Date.now(),
                    browserid:req.body.browserid,
                    // imgname:req.file.filename
            
                })
              
                
                if(task.save()){
                    console.log('Chat Add 3')  
                    // res.send('Chat Add')  
                }
                else{
                    console.log('chat error')
                }
    }
    else{
        console.log('no')

        if(req.body.adminmsg){
            const up_chat = chatModel.findOneAndUpdate({_id:req.body.id},
                {$push:{msg:[{admin_msg:req.body.adminmsg}]}})
           
            const admin_seq = chatModel.findOneAndUpdate({_id:req.body.id},{ admin_msg_status:req.body.admin_msg_status})    
             if(up_chat.exec() && admin_seq.exec()){
                 console.log('up admmin msg')   
                // res.send('up admin msg')
             }
            else{
               console.log(' up admin error')  
            }  
        }
        else if(req.body.usermsg){
            const up_chat = chatModel.findOneAndUpdate({_id:req.body.id},
                {$push:{msg:[{user_msg:req.body.usermsg}]}})
            
                const usr_seq = chatModel.findOneAndUpdate({_id:req.body.id},{user_msg_status:req.body.user_msg_status})    

        if(up_chat.exec() && usr_seq.exec()){
             console.log('up user msg 1')   
            //  res.send('up user msg 1')
        }
        else{
              console.log(' up error')  
        }
        }
      
                  
    }
    res.end()
})


router.post('/multiple',upload.array('admin_files'),async (req,res)=>{
    res.set("Content-Type","text/plain");
    res.set(200)
    
    var tk = req.body.admin_token;
    var tk_find = await token.findOne({tokenId:tk})
    var tk_email = tk_find['Admin_Email']; 
   
    var srch; 
    var data;
    var task =  await chatModel.find({});
 if(task){
    data = task

}
 else{
    res.send('no chat found')
    
}
    var t1 = await data.find((r)=> r.adminemail == tk_email && r.useremail == req.body.useremail) 
if(t1){
    res.send(t1)
    srch = 'y'
}
else{
    res.send('not found 11')
    srch = 'n'
}
    // const useremail =await chatModel.findOne({useremail:req.body.useremail},function(err,obj){
    //     if(err){
    //         console.log(err)
    //     }
    //     else if(obj){
        
    //         console.log(obj.adminemail)
    //     }
    //     else{
    //         srch = 'notfound'
    //         console.log('notfound')
    //     }
    // })
    if(srch == 'n'){
        let fileArray = [];
        req.files.forEach(e =>{
             const file = {
                 filename:e.filename,
                 originalname:e.originalname
               
             }   
             console.log(file)
             fileArray.push(file);
                var task = new chatModel({
              
                adminid:req.body.adminid,
                adminemail:tk_email,     
                msg:[
                    {
                        admin_msg:  req.body.adminmsg,
                        user_msg:  req.body.usermsg,                        
                        admin_filename:file['filename'],
                        admin_originalname:file['originalname'],
                       
                    },
                 
                ],
                userid:req.body.userid,
                username:req.body.username,
                useremail:req.body.useremail,
              
                time:Date.now(),
                browserid:req.body.browserid,
         
               
        
            })
            if(task.save()){
                console.log('Chat Add')    
            }
            else{
                console.log('chat error')
            }
        })
    }
    else{
        console.log('no')
       
        if(req.body.adminmsg || req.files){
            
            const admin_seq = chatModel.findOneAndUpdate({_id:req.body.id},{ admin_msg_status:req.body.admin_msg_status})  
        
            const up_chat = chatModel.findOneAndUpdate({_id:req.body.id},
                {$push:{msg:[{admin_msg:req.body.adminmsg}]}})
                if(req.files){
                    let fileArray = [];
                    req.files.forEach(e =>{
                         const file = {
                             filename:e.filename,
                             originalname:e.originalname
                           
                         }
                         fileArray.push(file);
                         console.log(file)
                         const up_chat = chatModel.findOneAndUpdate({_id:req.body.id},
                            {$push:{msg:[{ admin_filename:file['filename'],
                            admin_originalname:file['originalname']}]}})
                        if(up_chat.exec() && admin_seq.exec()){
                        //  console.log(req.body)
                            // console.log('up admin file mul')   
                            // res.send('up admin file')
                        }
                        else{
                            console.log(' up error')  
                        }
                        })   
                  
                }
                else{
                    console.log('admin file error')
                }
             if(up_chat.exec()){
                //  console.log('up admmin msg')   
                res.send('up admin msg')
             }
            else{
               console.log(' up admin error')  
            }  
        }
       
        // else if(req.body.usermsg){
        //     const usr_seq = chatModel.findOneAndUpdate({_id:req.body.id},{user_msg_status:req.body.user_msg_status})    

        //     const up_chat = chatModel.findOneAndUpdate({_id:req.body.id},
        //         {$push:{msg:[{user_msg:req.body.usermsg}]}})
        //         if(req.files){
        //             let fileArray = [];
        //             req.files.forEach(e =>{
        //                  const file = {
        //                      filename:e.filename,
        //                      originalname:e.originalname
                           
        //                  }
        //                  fileArray.push(file);
        //                  const up_chat = chatModel.updateOne({useremail:req.body.useremail},
        //                     {$push:{msg:[{ admin_filename:file['filename'],
        //                     admin_originalname:file['originalname']}]}})
        //                 if(up_chat.exec()){
                         
        //                     console.log('up admin file')   
        //                     res.send('up admin file')
        //                 }
        //                 else{
        //                     console.log(' up error')  
        //                 }
        //                 })   
                  
        //         }
        // if(up_chat.exec() && usr_seq.exec()){
        //      console.log('up user msg')   
        //      res.send('up user msg')
        // }
        // else{
        //       console.log(' up error')  
        // }
        // }
 
     
    }
    // var imgName = req.files;
    // for(let img of imgName ){
        // var task = new chatModel({
        //     id:'1',
        //     adminid:req.body.adminid,
        //     adminemail:req.body.adminemail,     
        //     adminmsg:req.body.adminmsg,
        //     userid:req.body.userid,
        //     username:req.body.username,
        //     useremail:req.body.useremail,
        //     usermsg:req.body.usermsg ,
        //     time:Date.now(),
        //     browserid:req.body.browserid,
        //     imgname:req.files.filename
    
        // })
        // if(task.save()){
        //     // console.log('Chat Add')    
        // }
        // else{
        //     console.log('chat error')
        // }
        // console.log(img)
        // console.log("name"+req.files['files'].filename)
    // }
 
res.end()
    
})
router.post('/Usermultiple',upload.array('admin_files'),async (req,res)=>{
    
     
    var tk = req.body.admin_token;
    var tk_find = await token.findOne({tokenId:tk})
    var tk_email = tk_find['Admin_Email']; 
   
   

    var task =  await chatModel.find({});
 if(task){
    data = task

}
 else{
    res.send('no chat found')
    
}
var t1 = await data.find((r)=> r.adminemail == tk_email && r.useremail == req.body.useremail) 
if(t1){
    res.send(t1)
    srch = 'y'
}
else{
    res.send('not found 11')
    srch = 'n'
}
    
    if(srch == 'n'){
        let fileArray = [];
        req.files.forEach(e =>{
             const file = {
                 filename:e.filename,
                 originalname:e.originalname
               
             }   
             console.log(file)
             fileArray.push(file);
                var task = new chatModel({
              
                adminid:req.body.adminid,
                adminemail:tk_email,     
                msg:[
                    {
                        admin_msg:  req.body.adminmsg,
                        user_msg:  req.body.usermsg,                        
                        admin_filename:file['filename'],
                        admin_originalname:file['originalname'],
                       
                    },
                 
                ],
                userid:req.body.userid,
                username:req.body.username,
                useremail:req.body.useremail,
              
                time:Date.now(),
                browserid:req.body.browserid,
         
               
        
            })
            if(task.save()){
                console.log('Chat Add')    
            }
            else{
                console.log('chat error')
            }
        })
    }
    else{
        console.log('no 1')

        if(req.body.adminmsg ){
            
            const admin_seq = chatModel.findOneAndUpdate({_id:req.body.id},{ admin_msg_status:req.body.admin_msg_status})  
            const up_chat = chatModel.findOneAndUpdate({_id:req.body.id},
                {$push:{msg:[{admin_msg:req.body.adminmsg}]}},)
                if(req.files){
                    let fileArray = [];
                    req.files.forEach(e =>{
                         const file = {
                             filename:e.filename,
                             originalname:e.originalname
                           
                         }
                         fileArray.push(file);
                        
                         const up_chat = chatModel.findOneAndUpdate({_id:req.body.id},
                            {$push:{msg:[{ user_filename:file['filename'],
                            user_originalname:file['originalname']}]}})
                        if(up_chat.exec() && admin_seq.exec()){
                         
                            console.log('up admin file')   
                            res.send('up admin file')
                        }
                        else{
                            console.log(' up error')  
                        }
                        })   
                  
                }
             if(up_chat.exec()){
                //  console.log('up admmin msg')   
                res.send('up admin msg')
             }
            else{
               console.log(' up admin error')  
            }  
        }
        else if(req.body.usermsg || req.files){
            const usr_seq = chatModel.findOneAndUpdate({_id:req.body.id},{user_msg_status:req.body.user_msg_status})    

            const up_chat = chatModel.findOneAndUpdate({_id:req.body.id},
                {$push:{msg:[{user_msg:req.body.usermsg}]}})
                if(req.files){
                    let fileArray = [];
                    req.files.forEach(e =>{
                         const file = {
                             filename:e.filename,
                             originalname:e.originalname
                           
                         }
                         fileArray.push(file);
                        
                         const up_chat = chatModel.findOneAndUpdate({_id:req.body.id},
                            {$push:{msg:[{ user_filename:file['filename'],
                            user_originalname:file['originalname']}]}})
                        if(up_chat.exec()){
                         
                            console.log('up admin file ')   
                           
                        }
                        else{
                            console.log(' up error')  
                        }
                        })   
                  
                }
        if(up_chat.exec() && usr_seq.exec()){
            //  console.log('up user msg 1')   
             res.send('up user msg 1')
        }
        else{
              console.log(' up error')  
        }
        }
 
     
    }
})
router.get('/:email',async(req,res)=>{
try{
    var tk = req.body.admin_token;
    var tk_find = await token({tokenId:tk})
    // console.log(req.headers);
    var task1 =await chatModel.find().where('adminemail').equals(req.params.email)
    var task = await chatModel.find({});
    if(task1){
           res.send(task1);
    }
    else{
        console.log('chat get error')
    }
}
catch(error){
    console.log(error)
}
res.end()
})

router.get('/user/:email/:uemail',async(req,res)=>{
    try{
       
    var tk = req.body.admin_token;

    var tk_find = await token.findOne({tokenId:tk})
 
    var data;
        var task = await chatModel.find({});
        if(task){
            data = task

        }
        else{
            res.send('not found')
        }


         var t1 =await chatModel
        var task1 =await task.find((r)=> r.adminemail == req.params.email && r.useremail == req.params.uemail)
        if(task1){
            res.send(task1)
        }
        else{
            res.send('not found1')
        }
                // var task2 =await chatModel.find().where('useremail').equals(req.params.uemail)
        // if(t1){
     
        //         res.send(t1)
            
       
        // }
        // else{
        //     console.log('chat get error')
        // }
    }
    catch(error){
        console.log(error)
    }
    
    })
router.get('/',async(req,res)=>{
    try{
        
    var tk = req.body.admin_token;
  
    var tk_find = await token.findOne({tokenId:tk})

    var task = await chatModel.find({});
    if(task){
   
       res.send(task);
    }
    else{
        console.log('chat get error')
    }
}
catch(error){
    console.log(error)
}
  
})
router.delete('/delete/:id',(req,res)=>{
    var id = req.params.id;
    var del = chatModel.findByIdAndDelete(id);
    del.exec((err,data)=>{
        if(!err){
            console.log('Chat  delete')
        }else{
            console.log('Chat Not delete')
        }
    })
})

router.post('/status/:id',async (req,res)=>{
   try{

   
    var id = req.params.id
    var ids = req.body.id;
    // console.log(id)
    const task2 =await chatModel.findByIdAndUpdate(id,{
    admin_msg_status:0,
    })
    if(task2.save()){
        res.json("admin status up")
    }
    else{
        res.json("admin not status")
    }
}
catch(err){
console.log(err)
}
})

router.post('/userstatus/:id',async (req,res)=>{
    var id = req.params.id
     var ids = req.body.id;
    //  console.log(id)
     const task2 =chatModel.findByIdAndUpdate(id,{
     user_msg_status:0,
 
     })
     if(task2.exec()){
         res.json("user status up")
     }
     else{
         res.json("user not status")
     }
 });
 

module.exports = router