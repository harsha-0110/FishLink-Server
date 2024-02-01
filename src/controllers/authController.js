const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

        // If all constraints are met, proceed to save the user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            username,
            phone,
            password: hashedPassword,
            userType
        });

        await user.save();

        res.json({ msg: 'User registered successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
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

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const payload = {
            user: {
                id: user.id
            }
        };
        
        jwt.sign(payload, 'jwtSecret', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token, userType: user.userType });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};
