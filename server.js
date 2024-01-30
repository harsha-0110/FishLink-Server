const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/fishlink', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define user schema and model
const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 20,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // Add email validation if needed
    },
    userType: {
      type: String,
      enum: ['Buyer', 'Seller'],
      required: true,
    },
  });
  const User = mongoose.model('User', UserSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Signup endpoint
app.post('/signup', async (req, res) => {
    try {
      const { username, password, email, userType } = req.body;
      const newUser = new User({ username, password, email, userType });
      await newUser.save();
      res.status(200).send('User registered successfully.');
      console.log('User registered successfully.')
    } catch (error) {
      res.status(400).send('Error registering user.');
      console.log('Error registering user.')
    }
  });

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).send('Login successful.');
      console.log('Login successful.')
    } else {
      res.status(401).send('Invalid username or password.');
      console.log('Invalid username or password.')
    }
  } catch (error) {
    res.status(400).send('Error logging in.');
    console.log('Error logging in.')
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
