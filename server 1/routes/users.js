const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');

router.post('/', async (req, res) => {
  try {
    
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(409).send('User with given email already exists');

    //const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password,10);
    console.log(hashPassword);
    
    
    const newUser = new User({ ...req.body, password: hashPassword });
    await newUser.save();

    res.status(201).send('User created successfully');
  } catch (error) {
    console.error('Signup Error:', error); 
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;