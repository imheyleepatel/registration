var express = require('express')

module.exports = function(ForgotPassword, Customer){
    
  var app = express()

  // forgot password
  app.get('/auth/forgot', function(req, res, next){
    return res.render('customer-forgot.html', {fail: req.query.fail})
  })

  app.post('/auth/forgot', function(req, res, next){
    Customer.findByEmail(req.body["forgot-email"], function(err, cus){
      if (err || cus.length == 0){
        return res.redirect("/auth/forgot?fail=1")
      }
      console.log("Generating forgotton password for", cus[0].email) 
      ForgotPassword.generate(cus[0], function(err){
        res.render('customer-forgot-sent.html', {customer: cus[0]});
      })
    })
  })

  app.get('/reset-forgotten', ForgotPassword.validateRequest.bind(ForgotPassword), function(req, res, next){
    res.render('change-password.html', {token: req.query.id})
  })


  app.post('/auth/reset', function(req, res, next){
    if (! req.body.token )
      return res.redirect("/auth/forgot") 

    ForgotPassword.verify(req.body.token, function(err, fg){
      
      if (err){
        console.log(">> ForgotPassword : Reset Error : ", err)
        return res.redirect("/auth/forgot?err=1")
      }

      Customer.findByEmail(fg.email, function(err, cus){
        if (err){
          console.log(">> ForgotPassword : Reset Error : ", err)
          return res.redirect("/auth/forgot?err=1")
        }

        cus.password = req.body.password
        cus.save(function(err){
          req.login(cus) 
          res.redirect("/?set-password=success")
        })
      })
    })
  })

  return app;
}
