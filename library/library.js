var multer = require('multer');
var mime = require('mime');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        url = __dirname;
        url = url.slice(0, url.lastIndexOf('/'));
        
        cb(null, url + "/uploads/")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
 module.exports.upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
      
        var ext = mime.getExtension(file.mimetype);
   
        if (ext !== 'png' && ext !== 'jpg' && ext !== 'gif' && ext !== 'jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }
}).single("pic");