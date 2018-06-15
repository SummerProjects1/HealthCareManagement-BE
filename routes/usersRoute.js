const express = require('express');
const router = express.Router();

//Register
router.post('/register', (req, res, next) => {
	res.send('REGISTER');
}); 

//AUTHENTICATE
router.post('/authenticate', (req, res, next) => {
	res.send('AUTHENTICATE');
}); 

//PROFILE
router.get('/profile', (req, res, next) => {
	res.send('PROFILE');
}); 

module.exports = router;