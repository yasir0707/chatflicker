var con = require('./conn');

var roleSchema = new con.Schema({

    role_name:String,
    admin_email:String


})
module.exports = con.model('admin_role',roleSchema)