const  mongoose  = require('mongoose');

mongoose.connect('mongodb+srv://chat01:123@chat.1dmf4.mongodb.net/test',
{ useNewUrlParser: true, useUnifiedTopology: true }, 

(err)=>{
    if(err){
          console.log('connection Error...',err)  
    }
    else{
        console.log('Connsection Success')
    }
})
// mongodb://localhost:27017/chat
// mongo "mongodb+srv://chat.n9fu8.mongodb.net/myFirstDatabase" --username chat01
// mongodb+srv://chat01:<password>@chat.n9fu8.mongodb.net/test
// mongodb+srv://chat01:<password>@chat.n9fu8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority




module.exports = mongoose


