
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login Request:', { email, password }); 

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found'); 
      return res.status(400).send('Invalid email or password');
    }
    //console.log(user);
   // console.log(password);
    //console.log(user.password);
        //const salt = await bcrypt.genSalt(Number(process.env.SALT));
       // const pass=await bcrypt.hash(password, 10);
    //console.log(pass);
    
    const validPassword = await bcrypt.compare(password, user.password);
    console.log(validPassword);
    
    if (!validPassword) {
      console.log('Invalid password');
      return res.status(400).send('Invalid email or password');
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_PRIVATE_KEY, { expiresIn: '24h' });
    console.log('Token generated:', token); 

    res.status(200).send({ token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;