//user.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    deviceId: {
        type: String
    },
    verified: {
        type: Boolean,
        required: true
    },
    // New fields
    bio: {
        type: String
    },
    harbour: {
        type: String
    },
    profilePic: {
        type: String
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
