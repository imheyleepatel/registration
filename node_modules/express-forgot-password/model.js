var crypto = require('crypto')
  , mailer = require('nodemailer')

module.exports = function(mailConfig, mailFrom, resetMailSubject, resetMailContent, mongoose) {
  var Schema = mongoose.Schema

var _createCode = function(){
  return crypto.randomBytes(10).toString('hex')
}

var ForgotPasswordSchema = new Schema({
  code: { type: String, index: true, default: _createCode }
, email : { type: String, required: true}
, sent : { type: Date, default: Date.now }
})

ForgotPasswordSchema.static('verify', function(token, cb){
  this.findOne({code: token}, function(err, forgot){
    if (err || !forgot){
      return cb("Invalid Code")
    }

    if (Date.now() - forgot.sent > (1000*60*60*12)){
      return cb("Invalid Code: Expired")
    }

    return cb(null, forgot)
  })
})

ForgotPasswordSchema.static('validateRequest', function(req, res, next){

  if (!req.query.id)
    return res.redirect('/auth/forgot?fail=2')

  this.verify(req.query.id, function(err, forgot){
    if (err){
      return res.redirect('/auth/forgot?fail=2')
    }
    next()
  })
})

ForgotPasswordSchema.static('generate', function(customer, cb){
  var forgot = new this({
    email: customer.email
  })
  
  forgot.save(function(err, forgot){
    if (err) return cb(err);

    console.log(">>> ForgotPassword sent:", customer.email)
    var emailTransport = mailer.createTransport("SMTP", mailConfig)

    console.log(">>mailer")
    var envelope = {
      from: mailFrom
    , to: customer.email
    , subject: resetMailSubject
    , text: resetMailContent(customer, '/reset-password?id=' + forgot.code)
    }

    emailTransport.sendMail(envelope, cb)
  })

})

var ForgotPassword = mongoose.model('ForgotPassword', ForgotPasswordSchema)

return ForgotPassword

}
