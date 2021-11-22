var con = require('./conn');


var graphSchema = new con.Schema({

    graph:
        {
    visit:Number,
    chat:Number,
    date:String,
        },
    admin_token:String,
    join_date:String
})

module.exports = con.model('graph',graphSchema)