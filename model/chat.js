
var mongoose = require('./conn');
var autoincrement =require('mongoose-auto-increment')

var ChatSchema = mongoose.Schema({


    adminid:String,
    adminemail:String,
    userid:String,
    username:String,
    useremail:String, 
    user_msg_status:Number, 
    admin_msg_status:{type:Number,default:0},
    msg:[
        
         {
            user_msg:String, 
            user_originalname:String,
            user_filename:String,
            admin_msg:String,
            admin_originalname:String,
            admin_filename:String,  
        },
  
       

    ],
 
    time:String,
    browserid:String,
 

})

autoincrement.initialize(mongoose.connection);
ChatSchema.plugin(autoincrement.plugin,{
    model: "chat", // collection or table name in which you want to apply auto increment
    field: "_id", // field of model which you want to auto increment
    startAt: 1, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
  })

//   ChatSchema.pre("save",function(next){
//       var docs = this;
//       mongoose.model('chat',ChatSchema).countDocuments(function(error,counter){
//           docs.user_msg_status  = counter+1;
//           next();
//       })
//   })
module.exports =mongoose.model('chat',ChatSchema)