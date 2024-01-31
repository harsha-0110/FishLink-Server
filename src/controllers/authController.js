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
        console.log('Done')
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
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
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            console.log('Invalid credentials1')
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log('Invalid credentials')
            return res.status(400).json({ msg: 'Invalid credentials2' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, 'jwtSecret', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
        console.log('Done')
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};
