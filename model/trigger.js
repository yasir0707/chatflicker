var mongoose = require('./conn');

var triggerSchema = mongoose.Schema({
   
    name:String,
    description:String,
    admin_id:String,
    admin_email:String
})

module.exports = mongoose.model('trigger',triggerSchema)