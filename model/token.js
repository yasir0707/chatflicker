var mongoose =require('./conn');


var tokenSchema =  new mongoose.Schema({
    tokenId:String,
    Admin_Email : String,
    expire : String
})

module.exports = mongoose.model('token',tokenSchema)