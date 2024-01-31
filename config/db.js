const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/fishlink'; // Your MongoDB URI

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
