var con = require('./conn');

var agentSchema = new con.Schema({

    Agent_Name:String,
    Agent_Email:String,
    Role:String,
    Admin_Email:String,
    password:String
})
module.exports = con.model('agent',agentSchema)