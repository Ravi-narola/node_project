var express = require('express');
const multer = require('multer');
var router = express.Router();
const { add_blog, view_blog, manage_blog, delete_blog, single_blog, register, get_data, login, logout} = require('../controller/usercontroller');

var auth = require('../middleware/auth');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  var upload = multer({ storage: storage })


/* GET User Page. */
router.post('/register',upload.single('image'),register);
router.get('/get_data',auth.check_token,get_data);
router.post('/login',login);
router.post('/logout',logout);


/* GET Blog Page. */
router.post('/add_blog',add_blog);
router.get('/view_blog',view_blog);
router.post('/manage_blog/:id',manage_blog);
router.get('/delete_blog/:id',delete_blog);
router.get('/single_blog/:id',single_blog);


module.exports = router;