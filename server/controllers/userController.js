var User = require('../models/userModel');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var nodemailer = require('nodemailer');

var REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
var ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

var userController = {
    register: async (req, res) => {
        try {
            var { name, email, password } = req.body;

            var existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({ msg: 'User with this email already exists' });
            }

            if (password.length < 6) {
                return res.status(400).json({ msg: 'Password should be at least 6 characters long' });
            }


            
            var passwordHash = await bcrypt.hash(password, 10);

            var newUser = new User({
                name,
                email,
                password: passwordHash
            });

            await newUser.save();

            // jwt token
            var accesstoken = createAccessToken({ id: newUser._id });
            var refreshtoken = createRefreshToken({ id: newUser._id });

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            });

            res.json({ accesstoken });

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    refreshtoken: async (req, res) => {
        try {
            var rf_token = req.cookies.refreshtoken;
            if (!rf_token) {
                return res.status(400).json({ msg: 'Please login or register' });
            }

            jwt.verify(rf_token, REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) {
                    return res.status(400).json({ msg: 'Please login or register' });
                }
                var accesstoken = createAccessToken({ id: user.id });
                res.json({ user, accesstoken });
            });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    adminLogin: async (req, res) => {
        try {
          const { email, password } = req.body;
      
          if (email !== 'tronixmartt@gmail.com' || password !== 'tronix1234') {
            return res.status(400).json({ msg: 'Invalid admin credentials' });
          }
      
          const user = await User.findOne({ email: 'tronixmartt@gmail.com' });
          if (!user) {
            return res.status(400).json({ msg: 'Admin user does not exist' });
          }
      
          const accesstoken = createAccessToken({ id: user._id });
          const refreshtoken = createRefreshToken({ id: user._id });
      
          res.cookie('refreshtoken', refreshtoken, {
            httpOnly: true,
            path: '/user/refresh_token',
          });
      
          return res.json({ accesstoken });
        } catch (error) {
          return res.status(500).json({ msg: error.message });
        }
      },

    login: async (req, res) => {
        try {
            var { email, password } = req.body;
            var user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: 'User does not exist' });
            }

            var isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Password does not match' });
            }

            var accesstoken = createAccessToken({ id: user._id });
            var refreshtoken = createRefreshToken({ id: user._id });

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            });

            return res.json({ accesstoken });

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    logout:async(req,res)=>
    {
        try{
            res.clearCookie('refreshtoken',{path:'/user/refresh_token'})

            return res.json({msg:'logout'})
        }
        catch(error)
        {
            res.status(500).json({msg:error.message})
        }
    },
    getUser:async(req,res)=>
        {
            try{

                var user=await User.findById(req.user.id).select('-password')

                if(!user)
                {
                    res.status(400).json({msg:'user not found'})
                }


                res.json(user)
                
            }
            catch(error)
            {
                res.status(500).json({msg:'invalid user'})
            }

        },
        
        
        forgotPassword: async (req, res) => {
            try {
                const { email } = req.body;
                const user = await User.findOne({ email });
    
                if (!user) {
                    return res.status(404).json({ msg: 'Email not found' });
                }
    
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
    
                user.resetPasswordOTP = otp;
                user.resetPasswordExpiry = otpExpiry;
                await user.save();
    
                // Send email with OTP
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'tronixmartt@gmail.com',
                        pass: process.env.EMAIL_PASSWORD
                    }
                });
    
                let mailOptions = {
                    from: 'tronixmartt@gmail.com',
                    to: email,
                    subject: 'Password Reset OTP',
                    html: `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f4f4;
                                    color: #333;
                                    margin: 0;
                                    padding: 0;
                                }
                                .container {
                                    width: 100%;
                                    max-width: 600px;
                                    margin: 0 auto;
                                    background-color: #ffffff;
                                    padding: 20px;
                                    border-radius: 8px;
                                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                                }
                                .header {
                                    text-align: center;
                                    padding: 10px 0;
                                }
                                .header img {
                                    width: 150px;
                                }
                                .content {
                                    text-align: center;
                                    padding: 20px;
                                }
                                .otp {
                                    font-size: 24px;
                                    font-weight: bold;
                                    color: #007bff;
                                    margin: 20px 0;
                                }
                                .footer {
                                    text-align: center;
                                    padding: 10px;
                                    font-size: 14px;
                                    color: #777;
                                }
                                .footer a {
                                    color: #007bff;
                                    text-decoration: none;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <img src="https://cdn.vectorstock.com/i/500p/60/06/letter-t-and-m-tm-logo-design-template-minimal-vector-50956006.jpg" alt="Company Logo">
                                    <h1>TronixMart</h1>
                                </div>
                                <div class="content">
                                    <h1>Password Reset Request</h1>
                                    <p>We received a request to reset your password. Use the following OTP to proceed with the reset:</p>
                                    <div class="otp">
                                        ${otp}
                                    </div>
                                    <p>This OTP is valid for 15 minutes. If you did not request this, please ignore this email.</p>
                                </div>
                                <div class="footer">
                                    <p>&copy; 2024 TronixMart. All rights reserved.</p>
                                    <p><a href="https://example.com/contact">Contact Us</a></p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `
                };
    
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ msg: 'Error sending email' });
                    }
                    res.json({ msg: 'OTP sent to email' });
                });
    
            } catch (error) {
                res.status(500).json({ msg: error.message });
            }
        },

        verifyOTP: async (req, res) => {
            try {
                const { email, otp } = req.body;
                const user = await User.findOne({ email });
    
                if (!user) {
                    return res.status(404).json({ msg: 'User not found' });
                }
    
                if (user.resetPasswordOTP !== otp || user.resetPasswordExpiry < Date.now()) {
                    return res.status(400).json({ msg: 'Invalid or expired OTP' });
                }
    
                // OTP is valid
                res.json({ msg: 'OTP verified successfully' });
    
            } catch (error) {
                res.status(500).json({ msg: error.message });
            }
        },
    
        resetPassword: async (req, res) => {
            try {
                const { email, newPassword } = req.body;
                const user = await User.findOne({ email });
    
                if (!user) {
                    return res.status(404).json({ msg: 'User not found' });
                }
    
                const passwordHash = await bcrypt.hash(newPassword, 10);
                user.password = passwordHash;
                user.resetPasswordOTP = undefined;
                user.resetPasswordExpiry = undefined;
                await user.save();
    
                res.json({ msg: 'Password reset successfully' });
    
            } catch (error) {
                res.status(500).json({ msg: error.message });
            }
        }
};

function createRefreshToken(payload) {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

function createAccessToken(payload) {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
}

module.exports = userController;
