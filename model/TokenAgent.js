var mongoose =require('./conn');


var tokenSchema =  new mongoose.Schema({
    tokenId:String,
    Agent_Email:String,
    Agent_Name:String,
    Role:String,
    Admin_Email : String,

})

module.exports = mongoose.model('tokenAgent',tokenSchema)