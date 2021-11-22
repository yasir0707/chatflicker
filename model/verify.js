var con = require('./conn');

var VerifySchema = new con.Schema({

    code:String,
    admin_email:String


})
module.exports = con.model('verify',VerifySchema)