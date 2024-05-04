const express = require('express');
const router = express.Router();
const Winner = require('../models/Winner');

// Update catch status
exports.updateCatchStatus = async (req, res) => {
  const { status, catchId } = req.body;

  try {
    // Find the winner entry by catchId
    const winner = await Winner.findOne({ catchId });

    if (!winner) {
      return res.status(404).json({ msg: 'Winner entry not found' });
    }

    // Update the status field
    winner.status = status;

    // Save the updated winner entry
    await winner.save();

    res.json({ msg: 'Status updated successfully', winner });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get catch status
exports.getCatchStatus = async (req, res) => {
  const { catchId } = req.params;

  try {
    // Find the winner entry by catchId
    const winner = await Winner.findOne({ catchId });

    if (!winner) {
      return res.status(404).json({ msg: 'Winner entry not found' });
    }

    res.json({ status: winner.status });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};