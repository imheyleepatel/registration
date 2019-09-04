module.exports.bcrypt = require('bcryptjs');
var include = require('../library/inculde')

exports.tokenfunction = function (hash_password) {

    return new Promise(function (reslove, reject) {

        return token = include.jwt.sign({
            password: hash_password
        }, 'shhhhh', function (err, data) {
            if (err) {
                return reject(err);
            } else {
                return reslove(data)
            }
        });

    })

}


exports.emailtoken= function(Email)
{
    return new Promise(function(reslove,reject){
        return token = include.jwt.sign({ email: Email}, 'shhhhh', { expiresIn: 60  }, function(err,data) {
            if(err){
                return reject("expire");
            } else {
                return reslove(data)
            }
        })

    })

}