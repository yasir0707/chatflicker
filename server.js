var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var initializeApp = require('firebase/app')
var getAnalytics = require('firebase/analytics')
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// var busboy = require('connect-busboy');
var app =express();
var Register = require('./routes/Register')
var User = require('./routes/user');
var Chat = require('./routes/Chat')
var trigger = require('./routes/trigger')
var role = require('./routes/role');
var agent = require('./routes/agent');
var link_r = require('./routes/link');
var graph = require('./routes/graph')
var config = require('./config')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.json()) 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public/upload'))
// app.use(busboy())
// app.use(fileUpload())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Content-Type","application/json");
   next();
    });
   
// Register 
app.use('/register',Register)
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, POST","PUT","DELETE");
    next()}
   );
app.use('/',(req,res)=>{
    res.send('<h1>Api</h1>')
})
//  User
app.use('/user',User)

//  CHAT
app.use('/chat',Chat)

// Trigger 
app.use('/trigger',trigger)

//  Role
app.use('/role',role)

// agent
app.use('/agent',agent)

// Link
app.use('/link',link_r)
// Graph
app.use('/graph',graph)

var port  = process.env.port || 3000;
app.listen(port, (err)=>{
    if(err){

        console.log('Error at server 1111')
    }
    else{
        console.log('Server at '+port)
    }
})

