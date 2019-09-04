# Forgot Password Flow

Express sub-app for a forgotton password flow.

## Assumptions:
- Mongodb / mongoose
- User model has `.findByEmail`

## Usage:

```javascript

var forgotton = require('express-forgotton-password')({ 
 // None of this is optional :(
  mailConfig: config // config for nodemailer
, mailFrom: "nomail" // mailer from address
, db: mongoose
, resetMailSubject : "Reset yout mysite password"
, resetMailContent : function(user, token){ 
    return "reset link: http://mysite" + token + " \n thanks" 
  }
, user : UserModel })
app.use(forgotton.app)

```
