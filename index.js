const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({limit: '50mb'}));

// Define Routes
app.use('/api', require('./src/routes/authRoutes'));
app.use('/api', require('./src/controllers/fpController'));

app.get('/verification', (req, res) => {
    res.sendFile(__dirname + '/templates/verification.html');
});

app.get('/reset-password/', (req, res) => {
    res.sendFile(__dirname + '/templates/reset-password.html');
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
