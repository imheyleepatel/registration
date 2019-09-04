const jwt = require('jsonwebtoken');
var Usermodel = require('../models/model');

exports.isauthentication = function(req,res,next){
    if(req.headers['x-access-token']){
        var token = req.headers['x-access-token'];
        req.headers.authorization = 'Bearer'+token;
        jwt.verify(token, "shhhhh", function(err , decode){
            if(err){
                return res.send("invalid token");
            }
            next();
        })
    }else {
        return res.send('unauthorized');
    }
}