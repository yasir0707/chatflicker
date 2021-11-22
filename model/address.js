var mongoose = require('./conn');

var addressSchema =  mongoose.Schema({
        adminemial:String,
        useremail:String,
        userip:Array,
        user_lat:String,
        user_lng:String,
        user_city:String,
        user_state:String,
        user_country:String,
})
module.exports = mongoose.model('address',addressSchema)