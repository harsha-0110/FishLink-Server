const express = require('express');
const connectDB = require('./config/db');
const cron = require('node-cron');
const path = require('path');
const Catch = require('./src/models/Catch');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({limit: '50mb'}));

// Define Routes
app.use('/api', require('./src/routes/authRoutes'));
app.use('/api', require('./src/routes/bidRoutes'));
app.use('/api', require('./src/routes/catchRoutes'));
app.use('/api', require('./src/routes/fpRoutes'));
app.use('/api/user', require('./src/routes/oneSignalRoutes'));

app.get('/verification', (req, res) => {
    res.sendFile(__dirname + '/templates/verification.html');
});

app.get('/reset-password/', (req, res) => {
    res.sendFile(__dirname + '/templates/reset-password.html');
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

/*cron.schedule('* * * * * *', async () => { 
    try {
        const currentTime = new Date();
        const availableCatches = await Catch.find({
          endTime: { $lt: currentTime },
          status: 'available'
        });
    
        availableCatches.forEach(catchDetails => {
            console.log('Catch Details:');
            console.log('Winner:', catchDetails.highestBidder);
            console.log('Name:', catchDetails.name);
            console.log('End Time:', catchDetails.endTime);
            console.log('Status:', catchDetails.status);
            console.log('----------------------------------------');
          });
      } catch (error) {
        console.error('Error fetching available catches:', error);
        throw error; // Propagate the error to the caller
      }
});*/