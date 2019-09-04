var express = require('express');

var bodyparser = require('body-parser');
const formrouter = require('./routers/router');

var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/user' , {
    keepAlive: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false

});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connectionerror'));

let port = 5000;

app.use(bodyparser.urlencoded({
    extended: true 
}));
app.use(bodyparser.json());

app.use('/user', formrouter);
app.listen(port, ()=> {
 console.log('server is running on  port number' + port);
});