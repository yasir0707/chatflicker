
var mongoose =require('./conn');


var SequencSchema = new mongoose.Schema({
    _id:String,
    sequence_value : {type:Number,default:0} 

})
module.exports = mongoose.model('sequence',SequencSchema)