var picdata = require('../library/library')
var include = require('../library/inculde')
var Promise = require('promise');
var Token = require('../library/token')
var Msg = require('../library/msg')

exports.user_signup = function (req, res) {
    picdata.upload(req, res, function (err) {
        if (err) {
            return res.send(err)
        } else {
            var hash_password = '';
            var checkmail = '';

            if (!req.body.password) {
                return res.send(include.sendrespons(null, false, 'password field is required'));
            }
            if (!req.body.email) {
                return res.send(include.sendrespons(null, false, 'email field is required'));
            }

            var hash_password = include.bcrypt.hashSync(req.body.password, 10);
            var checkmail = include.validator.isEmail(req.body.email);

            if (checkmail == true) {

                const UserModel = include.User.findOne({
                        email: req.body.email,
                    })
                    .then(function (createemail) {
                        if (!createemail) {

                            if (!req.file) {
                                return res.send(include.sendrespons(null, false, 'please! Select file'));
                            } else {

                                var Path = req.file.path

                                let newUser = new include.User({
                                    name: req.body.name,
                                    email: req.body.email,
                                    password: hash_password,
                                    pic: Path

                                });

                                newUser.save(function () {
                                    return res.status(200).send('your data is successfully entered in database')
                                })
                            }
                        } else {
                            return res.send(include.sendrespons(null, false, 'This email-id is already used....try another'));
                        }
                    })
                    .catch(function (err) {
                        return res.send(include.sendrespons(err, false, 'error'));
                    })
            } else {
                return res.send('Invalid email entered');
            }
        }
    })
}


exports.user_login = function (req, res) {
    if (!req.body.email) {
        return res.send('Enter email first');
    }
    include.User.findOne({
        email: req.body.email
    }).then(async function (data) {
        if (data) {


            if (data.forget == false) {


                if (!req.body.password) {
                    return res.send(include.sendrespons(null, false, 'Enter your password'));
                }
                dbpassword = data.password;
                var password = include.bcrypt.compareSync(req.body.password, dbpassword);
                var tokendata = await Token.tokenfunction(req.body.password);

                if (password == true) {
                    return res.send(include.sendrespons(null, false, 'log in'));

                } else {
                    return res.send(include.sendrespons(null, true, 'Enter valid password'));
                }

            } else {
                return res.send("denied")
            }
        }


    }).catch(function (err) {
        return res.send(include.sendrespons(err, false, 'error'));
    })
}






exports.forgetpassword = function (req, res) {

    var checkmail = '';
    var token = '';


    if (!req.body.email) {
        return res.send("Enter email first");
    }

    checkmail = include.validator.isEmail(req.body.email);

    if (checkmail == true) {
        include.User.findOne({
            email: req.body.email,
        }).then(async function (forgetInstance) {

            if (forgetInstance) {
                var emaildata = await Token.emailtoken(forgetInstance.email)
                console.log(emaildata)
                var msgs = await Msg.msgdata(emaildata)
                include.User.findOneAndUpdate({
                    _id: forgetInstance.id,
                    $set: {
                        forget: "true"
                    }
                }).then(function (data) {

                    return res.send(include.sendrespons(emaildata, false, "Token Data."));
                })

            } else {
                return res.send(include.sendrespons(null, tru, "Email is not registered."));
            }
        }).catch(function (err) {
            return res.send("Error: " + err);
        })
    } else {
        return res.send(include.sendrespons(null, true, "Invalid Email."));
    }
}


exports.userdata = function (req, res) {
    include.User.find().then(function (data) {
        return res.send(data)
    })
}

exports.resetpassword = function (req, res) {

    var decoded = '';
    var new_pass_length = '';
    var confirm_pass_length = '';
    if (!req.body.token) {
        return res.send('Token is require')
    }
    decoded = include.jwt.verify(req.body.token, 'shhhhh');

    if (decoded) {
        include.User.findOne({
            email: decoded.email,
        }).then(function (resetInstance) {

            new_pass_length = include.validator.isLength(req.body.new_password, {
                min: 1,
                max: 5
            })
            confirm_pass_length = include.validator.isLength(req.body.confirm_password, {
                min: 1,
                max: 5
            })

            if (new_pass_length && confirm_pass_length == true) {


                if (req.body.new_password === req.body.confirm_password) {
                    let hash = include.bcrypt.hashSync(req.body.new_password, 10);
                    resetInstance.password = hash;
                    resetInstance.save(function (err, done) {
                        include.User.findOneAndUpdate({
                            _id: resetInstance.id,
                            $set: {
                                forget: "true"
                            }
                        }).then(function (data) {

                            return res.send(include.sendrespons(null, false, "Password Updated."))
                        })

                    })
                } else {
                    return res.send(include.sendrespons(null, false, "Password not matched"));
                }
            } else {

                return res.send(include.sendrespons(null, false, "Password Length Must Be between 1 to 5."))

            }
        }).catch(function (err) {
            return res.send("Error: " + err);
        });

    } else {
        return res.send(include.sendrespons(null, false, "Data Not Found"))
    }
}


exports.delete = function (req, res) {
    include.User.findOneAndDelete({
        email: req.body.email
    }).then(function (data) {
        return res.send(include.sendrespons(data, false, "data deleted"))
    })
}

exports.find = function (req, res) {
    include.User.find({
        name: req.body.name
    }).then(function (data) {
        return res.send(include.sendrespons(data, false, 'users matched'))
    })
}

exports.stock = async function (req, res) {
    try{

    var input = req.body.input;

    const quoteData = await include.iex.quote(input);
    // do something with returned quote data
    console.log(quoteData)
    return res.send(include.sendrespons(quoteData, false, 'data'))
   
}
    catch (error){
        console.log(error)
        return res.send(include.sendrespons(error.message , true , 'error msg'))
    }
   
}






