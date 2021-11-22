const jwt = require('jsonwebtoken');
var mongoose = require('./conn');

var RegisterSchema = new mongoose.Schema({
  
    Admin_Name:String,
    Admin_Company:String,
    Admin_Email:String,
    Admin_Number:String,
    Admin_Password:String,
    Join_Date:String
   
});

// RegisterSchema.methods.generateAuthToken = async function(){
//     try{
//         const token = jwt.sign({_id:this._id},"qwertyuioplkjhgfdsazxcvbnm0987654321");
//         this.tokens = this.tokens.concat({token:token})

//         await this.save()
//         return token;
//         console.log(token)
//     }
//     catch(error){
//         console.log(error)
//     }
// }
module.exports = mongoose.model("reg",RegisterSchema);