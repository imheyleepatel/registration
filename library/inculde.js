module.exports.User = require('../models/model');
module.exports.sendrespons = require('../library/responslib')
module.exports.bcrypt = require('bcryptjs');
module.exports.validator = require('validator');
module.exports.jwt = require('jsonwebtoken');
module.exports.sgMail = require('@sendgrid/mail');
SENDGRID_API_KEY = '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';
module.exports.iex = require( 'iexcloud_api_wrapper' )
module.exports.sgMail.setApiKey(SENDGRID_API_KEY);




