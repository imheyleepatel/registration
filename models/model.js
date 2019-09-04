const mangoose = require('mongoose');



const UserSchema = mangoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: String,
    pic : String,
    forget : {
        type  : Boolean,
        default : false
    }
  
});


module.exports = mangoose.model('user', UserSchema);