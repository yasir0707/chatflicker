var con = require('./conn');

var roleSchema = new con.Schema({

    role_name:String,


})
module.exports = con.model('role',roleSchema)