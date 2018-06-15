const express = require('express');
const router = express.Router();
//const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
const config = require('../config/database');

//Register
router.post('/register', (req, res, next) => {
	//create user object 
	let newUser = new User({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		retypepassword: req.body.retypepassword,
		contact: req.body.contact
	});

	User.addUser(newUser, (err, user) => {
		if(err){
			res.json({success: false, msg: 'Failed to register user'});
		} else{
		  console.log(user);
		  res.json({success: true, msg: 'User Registered'});
		}
	});
}); 

//Authenticate
router.post('/authenticate', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;

	User.getUserByUsername(username, (err, user) => {
		if(err) throw err;
		if(!user) {
			return res.json({success: false, msg: 'User not found'});
		}

		User.comparePassword(password, user.password, (err, isMatch) => {
			if(err) throw err;
			if(isMatch) {
				const token = jwt.sign({data: user}, config.secret, {
					expiresIn: 604800 //1 week
				});

				res.json({
					success: true,
					token: 'JWT ' + token,
					user: {
						id: user._id,
						firstname: user.firstname,
						lastname: user.lastname,
						username: user.username,
						email: user.email,
						contact: user.contact
					}
				});
			} else {
				return res.json({success: false, msg: 'Wrong Password'});
			}
		});
	});
});



/* //To protect routing to profile - Comment this if no security is needed: (passport.authenticate('jwt', {session:false}),)
router.get('/profile', passport.authenticate('jwt', {session:false}),(req, res, next) => {
	res.json({user: req.user});
}); */

module.exports = router;