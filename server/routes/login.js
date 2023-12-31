/* jshint esversion: 9 */

const express = require('express');
const router=express.Router();
const User  = require('../models/user');

const crypto = require('crypto');
const {sendPasswordEmail}=require("./mailService");
const {saveData}=require("../models/savedata");

const tempPasswords = {};


router.get('/:username', async (req, res) => {
  const username = req.params.username;
console.log("i start work")
  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a new special password
    const newPassword = crypto.randomBytes(8).toString('hex');

    // Update the special password field in the database
    user.specialPassword = newPassword;
    await user.save();

    const email = user.email;
console.log(newPassword)
    // Send the new special password to the user
    sendPasswordEmail(email, newPassword); // Call the sendPasswordEmail function

    res.status(200).json({ message: 'password sent to the user' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a route to check the password and redirect to INDEX page
router.post('/login', async (req, res) => {
    const { username, specialPassword } = req.body;
  
    try {
      // Find the user by username
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Compare the entered password with the stored password
      if (specialPassword === user.specialPassword) {
        // Passwords match, redirect to the INDEX page
        // res.redirect(".../client/index");
        console.log(specialPassword);
        res.status(200).json({ msg:' password'});
        // You should replace '/index' with the actual route of your INDEX page
      } else {
        res.status(401).json({ error: 'Incorrect password' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  




module.exports = router;