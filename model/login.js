
var mongoose = require('./conn');

var LoginSchema = new mongoose.Schema({
  
    Admin_Email:String,
    Admin_Password:String,
    User_type:String,
    status:{type:Number,default:0}

},
{
    minimize:false
});

module.exports = mongoose.model("login",LoginSchema);