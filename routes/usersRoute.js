const express = require('express');
const router = express.Router();
//const passport = require('passport');
var secret = 'harrypotter';
const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
const config = require('../config/database');
const sgMail = require('@sendgrid/mail');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

let transporter = nodemailer.createTransport({
	service: 'gmail',
	secure: false,
	port:25,
	auth:{
		user:'dev.nagarjuna2018@gmail.com',
		pass:'Summer@2018'
	},
	tls: {
		rejectUnauthorized: false
	}
});

let helperOptions = {
	from: '"HipCatC Application"<dev.nagarjuna2018@gmail.com>"',
	to:'dev.nagarjuna2018@gmail.com',
	subject: "Hello Nagarjuna",
	text: "Thank you for registering with us!!"
};

sgMail.setApiKey('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');

const msg = {
	to: 'nagarjunakuppala07@gmail.com',
	from: 'dev.nagarjuna2018@gmail.com',
	subject: 'Sending with SendGrid is Fun',
	text: 'and easy to do anywhere, even with Node.js',
	html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };

router.get('/getMail', (req, res, next)=>{
	sgMail.send(msg, function(err, json){
		if(err){
			res.json(err);
			console.log('fail');
		}else{
			console.log('success');
			res.json(json);
		}
	});
});

router.post('/sendMail', (req, res, next) => {
	transporter.sendMail(helperOptions, (error, info)=>{
		if(error){
			console.log(error);
			res.json(error);
		}else{
			console.log(error);
			res.json(info);
		}
	});
});

//registering new user
router.post('/register', (req, res, next) => {
	//create user object 
	let newUser = new User();
		newUser.firstname = req.body.firstname;
		newUser.lastname = req.body.lastname;
		newUser.username = req.body.username;
		newUser.email = req.body.email;
		newUser.password = req.body.password;
		newUser.retypepassword = req.body.retypepassword;
		newUser.contact = req.body.contact;
		newUser.temporaryToken = jwt.sign({ username: newUser.username, email: newUser.email }, secret, { expiresIn: '24h' }); // Create a token for activating account through e-mail
	console.log(newUser);
	User.addUser(newUser, (err, user) => {
		if(err){
			if(err.code == 11000){
				res.json({ success: false, msg: 'Username or email already registered!' });
			}
			
		} else{
			console.log("2");
			let helperOptions = {
				from: '"HipCatC Application"<dev.nagarjuna2018@gmail.com>"',
				to:user.email,
				subject: "HipCat C application account activation link "+newUser.firstname,
				text: 'Hello '+newUser.firstname+'\n\nThank you for registering with us!!'+
				'Please click on the below link to activate your account. \n http://localhost:4200/activate/'+newUser.temporaryToken,
				html:'Hello <strong>'+newUser.firstname+'</strong>,<br><br>Thank you for registering with us!!<br><br>'+
						'Please click on the below link to activate your account. <br><a href="http://localhost:4200/activate/'+newUser.temporaryToken+'">http://localhost:4200/activate/</a>'
			};
			transporter.sendMail(helperOptions, (error, info)=>{
				if(error){
					console.log(error);
					res.json(error);
				}else{
					console.log(info);
					res.json({ success: true, msg: 'Account registered! Please check your e-mail for activation link.' });
				}
			});

		  console.log(user);
		  res.json({ success: true, msg: 'Account registered! Please check your e-mail for activation link.' });
		}
	});
}); 

//email activation method
router.put('/activate/:token', function(req, res) {
	User.findOne({ temporaryToken: req.params.token }, function(err, user) {
		if (err) res.json({ success: false, message: err }); ; 
		var token = req.params.token; 
		jwt.verify(token, secret, function(err, decoded) {
			if (err) {
				res.status("200").send({ success: false, message: 'Activation link has expired.' }); 
			} else if (!user) {
				res.status("200").send({ success: false, message: 'Activation link has expired.' }); 
			} else {
				user.temporaryToken = false;
				user.isActivated = true; 
				user.save(function(err) {
					if (err) {
						console.log(err); 
					} else {
						var email = {
							from: 'Localhost Staff, staff@localhost.com',
							to: user.email,
							subject: 'Localhost Account Activated',
							text: 'Hello ' + user.firstname + ', \n\n Your account has been successfully activated!',
							html: 'Hello<strong> ' + user.firstname + '</strong>,<br><br>Your account has been successfully activated!'
						};
						transporter.sendMail(email, function(err, info) {
							if (err) console.log(err); 
						});
						res.json({ success: true, message: 'Account activated!' }); 
					}
				});
			}
		});
	});
});

//Authenticate
router.post('/authenticate', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	console.log(username);
	console.log(password);
	User.getUserByUsername(username, (err, user) => {
		if(err) console.log(err);
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

router.delete('/deleteUser/:id', (req, res, next)=>{
	User.remove({_id: req.params.id},function(err, result){
		if(err){
			res.json(err);
		}else{
			res.json(result);
		}
	})
});

router.get('/users', (req, res, next)=>{
	User.find(function(err, user){
		if(err){
			res.json(err);
		}else{
			res.json(user);
		}
	});
});



/* //To protect routing to profile - Comment this if no security is needed: (passport.authenticate('jwt', {session:false}),)
router.get('/profile', passport.authenticate('jwt', {session:false}),(req, res, next) => {
	res.json({user: req.user});
}); */

module.exports = router;