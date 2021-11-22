var con = require('./conn');

var LinkSchema = new con.Schema({

    link:String,
    agent_name:String,
    id:String,
    admin_email:String,
    


})
module.exports = con.model('link',LinkSchema)