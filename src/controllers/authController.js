const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
require('dotenv').config();


exports.signup = async (req, res) => {
    const { name, email, username, phone, password, userType } = req.body;

    // Regular expressions for password constraints
    const passwordLengthRegex = /^.{8,}$/;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /[0-9]/;
    const specialCharRegex = /[@#$%^&+=]/;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        let user1 = await User.findOne({ username });
        if (user1) {
            return res.status(400).json({ msg: 'Username Taken' });
        }

        let user2 = await User.findOne({ phone });
        if (user2) {
            return res.status(400).json({ msg: 'Phone Number Linked with another account' });
        }

        if (!passwordLengthRegex.test(password)) {
            return res.status(400).json({ msg: 'Password must be at least 8 characters long' });
        }

        if (!uppercaseRegex.test(password)) {
            return res.status(400).json({ msg: 'Password must contain at least one uppercase letter' });
        }

        if (!lowercaseRegex.test(password)) {
            return res.status(400).json({ msg: 'Password must contain at least one lowercase letter' });
        }

        if (!digitRegex.test(password)) {
            return res.status(400).json({ msg: 'Password must contain at least one digit' });
        }

        if (!specialCharRegex.test(password)) {
            return res.status(400).json({ msg: 'Password must contain at least one special character (@#$%^&+=)' });
        }

        // If all constraints are met, proceed to save the user with verified status false
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            username,
            phone,
            password: hashedPassword,
            userType,
            verified: false // Set verified status to false
        });

        await user.save();

        // Send verification email
        sendVerificationEmail(email, user._id.toString());

        res.json({ msg: 'User registered successfully. Please check your email for verification instructions.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Function to send verification email
const sendVerificationEmail = (email, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT, { expiresIn: '1d' });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, // Your Gmail email address
            pass: process.env.PASS // Your Gmail email password
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Account Verification',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <p style="text-align: center;">
                    <h1>Welcome to FishLink</h1>
                </p>
                <p style="font-size: 16px;">Thank you for signing up!</p>
                <p style="font-size: 16px;">Please click the following button to verify your account:</p>
                <p style="text-align: center;">
                    <a href="${process.env.URL}/api/verify/${token}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px;">Verify Account</a>
                </p>
            </div>
        `
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

// Endpoint to handle account verification
exports.verifyAccount = async (req, res) => {
    const token = req.params.token;

    if (!token) {
        return res.redirect('/verification?msg=Invalid%20token');
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT);
        // Extract user ID from the token payload
        const userId = decoded.userId;
        

        // Find the user in the database
        const user = await User.findById(userId);

        if (!user) {
            res.redirect('/verification?msg=User%20not%20found');
        }

        // Update user's verified status to true
        user.verified = true;
        await user.save();

        res.redirect('/verification?msg=Account%20verified%20successfully');
    } catch (error) {
        console.error(error.message);
        res.redirect('/verification?msg=Server%20error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Email Not Found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        const isVerified = user.verified;

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        if (!isVerified) {
            return res.status(400).json({ msg: 'User not verified' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };
        
        jwt.sign(payload, process.env.JWT, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token, name: user.name, userType: user.userType });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};
