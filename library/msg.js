var Controller = require('../controllers/controller')
var include = require('./inculde')
exports.msgdata = function (Message) {
    return new Promise(function (resolve, reject) {
        if(Message){
            var msg = {
            to: 'heyahelly@gmail.com',
            from: 'hela@gmail.com',
            subject: 'Sending with SendGrid',
            html: Message,
        }

        return resolve(include.sgMail.send(msg));}
        else {
                return reject(err)
            }

    })
};