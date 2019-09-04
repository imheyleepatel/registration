const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
var multer = require('multer');
var authentication = require('../middleware/authentication');


router.post('/login',  controller.user_login);
router.post('/signup',controller.user_signup);
router.get('/data',authentication.isauthentication, controller.userdata);
router.post('/forget', controller.forgetpassword);
router.post('/reset', controller.resetpassword);
router.post('/delete',controller.delete);
router.post('/find',controller.find);
router.post('/show',controller.stock);


module.exports = router;