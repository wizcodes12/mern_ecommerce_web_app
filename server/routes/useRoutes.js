var express = require('express');
var router = express.Router();
var cors = require('cors'); 
var userController = require('../controllers/userController');
var auth = require('../middleware/auth');


var authAdmin = require('../middleware/authAdmin');

// Use cors for all routes in this router
// router.use(cors());

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.post('/refresh_token', userController.refreshtoken);
router.get('/information', auth, userController.getUser);


router.post('/forgot-password', userController.forgotPassword);
router.post('/verify-otp', userController.verifyOTP);
router.post('/reset-password', userController.resetPassword);


router.post('/admin/login', userController.adminLogin);

router.get('/admin/dashboard', auth, authAdmin, (req, res) => {
    res.json({ msg: 'Welcome to the admin dashboard!' });
  });



router.post('/register', auth, authAdmin, userController.register);


module.exports = router;