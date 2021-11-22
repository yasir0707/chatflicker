
var mongoose = require('./conn');


var UserSchema =new  mongoose.Schema({

    id:String,
    browserid:String,
    user_email:String,
    user_name:String,
    user_message:String,
    admin_email:String,
    Date:{type:Date,default:Date.now},

},{
    minimize:false
})

module.exports =mongoose.model('user',UserSchema)