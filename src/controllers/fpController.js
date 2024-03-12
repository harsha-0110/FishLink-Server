const bcrypt = require('bcryptjs');
const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user with the provided email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Generate a reset password token
        const token = jwt.sign({ email }, process.env.JWT, { expiresIn: '1h' });

        // Send the reset password email with the token
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
            subject: 'Reset Password',
            html: `
                <p>Please click the following link to reset your password:</p>
                <a href="${process.env.URL}/reset-password/?tkn=${token}">Reset Password</a>
            `
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                return res.status(500).json({ msg: 'Failed to send reset password email' });
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).json({ msg: 'Reset password email sent successfully' });
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Route to handle password reset submission
exports.resetPassword = async (req, res) => {
    const token = req.params.token;
    const { password, confirmPassword } = req.body;

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT);
        const email = decoded.email;
    
        // Find the user by email
        let user = await User.findOne({ email });
    
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }
    
        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ msg: 'Passwords do not match' });
        }
    
        // Check password length
        if (password.length < 8 || password.length > 16) {
            return res.status(400).json({ msg: 'Password must be between 8 and 16 characters long' });
        }
    
        // Check for at least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({ msg: 'Password must contain at least one uppercase letter' });
        }
    
        // Check for at least one lowercase letter
        if (!/[a-z]/.test(password)) {
            return res.status(400).json({ msg: 'Password must contain at least one lowercase letter' });
        }
    
        // Check for at least one digit
        if (!/\d/.test(password)) {
            return res.status(400).json({ msg: 'Password must contain at least one digit' });
        }
    
        // Check for at least one special character
        if (!/[@$!%*?&]/.test(password)) {
            return res.status(400).json({ msg: 'Password must contain at least one special character (@$!%*?&)' });
        }
    
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        // Update the user's password
        user.password = hashedPassword;
        await user.save();
    
        return res.status(200).json({ msg: 'Password reset successfully' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ msg: 'Invalid Link' });
    }
};