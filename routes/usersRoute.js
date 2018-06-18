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
	port: 25,
	auth: {
		user: config.userName,
		pass: config.password
	},
	tls: {
		rejectUnauthorized: false
	}
});

let helperOptions = {
	from: '"HipCatC Application"<dev.nagarjuna2018@gmail.com>"',
	to: 'dev.nagarjuna2018@gmail.com',
	subject: "Hello Nagarjuna",
	text: "Thank you for registering with us!!"
};

sgMail.setApiKey(config.SENDGRID_API_KEY);

const msg = {
	to: 'nagarjunakuppala07@gmail.com',
	from: 'dev.nagarjuna2018@gmail.com',
	subject: 'Sending with SendGrid is Fun',
	text: 'and easy to do anywhere, even with Node.js',
	html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

router.get('/getMail', (req, res, next) => {
	sgMail.send(msg, function (err, json) {
		if (err) {
			res.json(err);
			console.log('fail');
		} else {
			console.log('success');
			res.json(json);
		}
	});
});

router.post('/sendMail', (req, res, next) => {
	transporter.sendMail(helperOptions, (error, info) => {
		if (error) {
			console.log(error);
			res.json(error);
		} else {
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
	User.addUser(newUser, (err, user) => {
		if (err) {
			if (err.code == 11000) {
				res.json({ success: false, msg: 'Username or email already registered!' });
			}

		} else {
			let helperOptions = {
				from: 'HipCatC Application, hipcatc@localhost.com',
				to: user.email,
				subject: "HipCat C  account activation link " + newUser.firstname,
				text: 'Hello ' + newUser.firstname + '\n\nThank you for registering with us!!' +
					'Please click on the below link to activate your account. \n http://localhost:4200/activate/' + newUser.temporaryToken,
				html: 'Hello <strong>' + newUser.firstname + '</strong>,<br><br>Thank you for registering with us!!<br><br>' +
					'Please click on the below link to activate your account. <br><a href="http://localhost:4200/activate/' + newUser.temporaryToken + '">http://localhost:4200/activate/</a>'
			};
			transporter.sendMail(helperOptions, (error, info) => {
				if (error) {
					console.log(error);
					res.json(error);
				} else {
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
router.put('/activate/:token', function (req, res) {
	User.findOne({ temporaryToken: req.params.token }, function (err, user) {
		if (err) res.json({ success: false, message: err });
		var token = req.params.token;
		jwt.verify(token, secret, function (err, decoded) {
			if (err) {
				res.json({ success: false, message: 'Activation link has expired.' });
			} else if (!user) {
				res.json({ success: false, message: 'Activation link has expired.' });
			} else {
				user.temporaryToken = false;
				user.isActivated = true;
				user.save(function (err) {
					if (err) {
						console.log(err);
					} else {
						var email = {
							from: 'HipCatC Application, hipcatc@localhost.com',
							to: user.email,
							subject: 'HipCatC Account Activated',
							text: 'Hello ' + user.firstname + ', \n\n Your account has been successfully activated!'
								+ '\n\n Please click here to login: http://localhost:4200/',
							html: 'Hello<strong> ' + user.firstname + '</strong>,<br><br>Your account has been successfully activated!'
								+ '<br><br> Please click here to login <a href="http://localhost:4200/"></a>'
						};
						transporter.sendMail(email, function (err, info) {
							if (err) console.log(err);
						});
						res.json({ success: true, message: 'Account activated!' });
					}
				});
			}
		});
	});
});

router.put('/resendLink', function (req, res) {
	User.findOne({ email: req.body.email }).select('username firstname lastname email temporaryToken isActivated').exec(function (err, user) {
		if (err) {
			console.log(err);
			throw err;
		} else {
			if (user != null) {
				if (user.isActivated) {
					res.json({ success: true, code: 'USERALREADYACTIVATED', message: 'User account already activated !!' })
				} else {
					user.temporaryToken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
					user.save(function (err) {
						if (err) {
							console.log(err);
						} else {
							var email = {
								from: 'HipCatC Application, hipcatc@localhost.com',
								to: user.email,
								subject: 'HipCatC Activation Link Request',
								text: 'Hello ' + user.firstname + ', \n\n You recently requested a new account activation link. Please click on the following link to complete your activation: http://localhost:4200/activate/' + user.temporaryToken,
								html: 'Hello<strong> ' + user.firstname + '</strong>,<br><br>You recently requested a new account activation link. Please click on the link below to complete your activation:<br><br><a href="http://localhost:4200/activate/' + user.temporaryToken + '">http://localhost:4200/activate/</a>'
							};
							transporter.sendMail(email, function (err, info) {
								if (err) console.log(err);
							});
							res.json({ success: true, code: 'ACTIVATIONLINKSENT', message: 'Activation link has been sent to ' + user.email + '!' });
						}
					});
				}
			} else {
				res.json({ success: false, code: 'USERNOTEXIST', message: 'User doesnt exist.' });
			}

		}
	});
});

router.put('/forgotPwd', function (req, res) {
	User.findOne({ email: req.body.email }).select('username firstname lastname email temporaryToken isActivated').exec(function (err, user) {
		if (err) {
			console.log(err);
			throw err;
		} else {
			if (user != null) {
				user.temporaryToken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
				user.save(function (err) {
					if (err) {
						console.log(err);
					} else {
						var email = {
							from: 'HipCatC Application, hipcatc@localhost.com',
							to: user.email,
							subject: 'HipCatC Account Password request',
							text: 'Hello ' + user.firstname + ', \n\n You recently requested password reset. Please click on the following link to reset your password: http://localhost:4200/resetPwd/' + user.temporaryToken
								+ ' \n\n\n Regards,\n HipCatC Team.',
							html: 'Hello<strong> ' + user.firstname + '</strong>,<br><br>You recently requested password reset. Please click on the link below to reset your password:<br><br><a href="http://localhost:4200/resetPwd/' + user.temporaryToken + '">http://localhost:4200/resetPwd/</a>'
								+ '<br><br><br>Regards,<br>HipCatC Team.'
						};
						transporter.sendMail(email, function (err, info) {
							if (err) console.log(err);
						});
						res.json({ success: true, code: 'ACTIVATIONLINKSENT', message: 'Password change request link has been sent to ' + user.email + '!' });
					}
				});
			} else {
				res.json({ success: false, code: 'USERNOTEXIST', message: 'User doesnt exist.' });
			}

		}
	});
});

router.put('/resetPwd', function (req, res) {
	User.findOne({ temporaryToken: req.body.token }, function (err, user) {
		if (err) {
			console.log(err);
			throw err;
		} else {
			var token = req.body.token;
			jwt.verify(token, secret, function (err, decoded) {
				if (err) {
					res.json({ success: false, message: 'Password reset link has expired.' });
				} else if (!user) {
					res.json({ success: false, message: 'Password reset link has expired.' });
				} else {
					user.temporaryToken = false;
					user.password = req.body.password;
					user.retypepassword = req.body.password;
					User.addUser(user, (err, user) => {
						if (err) {
							console.log(err);
						} else {
							var email = {
								from: 'HipCatC Application, hipcatc@localhost.com',
								to: user.email,
								subject: 'HipCatC Account Password Reset Success',
								text: 'Hello ' + user.firstname + ', \n\n Your password has been successfully updated!'
									+ '\n\n Please click here to login: http://localhost:4200/'
									+ '\n\n Regards \n HipCatC Team',
								html: 'Hello<strong> ' + user.firstname + '</strong>,<br><br>Your password has been successfully updated!'
									+ '<br><br> Please click here to login <a href="http://localhost:4200/"></a>'
									+ '<br><br> Regards<br>HipCatC Team.'
							};
							transporter.sendMail(email, function (err, info) {
								if (err) console.log(err);
							});
							res.json({ success: true, message: 'Your password successfully updated!' });
						}
					});
				}
			});
		}
	});
});


//Authenticate
router.post('/authenticate', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	User.getUserByUsername(username, (err, user) => {
		if (err) console.log(err);
		if (!user) {
			return res.json({ success: false, code: 'USERNOTFOUND', msg: 'User not found' });
		}else{
			if(user.isActivated){
				User.comparePassword(password, user.password, (err, isMatch) => {
					if (err) throw err;
					if (isMatch) {
						const token = jwt.sign({ data: user }, config.secret, {
							expiresIn: '1h' //1 hour
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
						return res.json({ success: false,  code: 'PASSWORDWRONG', msg: 'Wrong credentials. Please check.' });
					}
				});
			}else{
				return res.json({ success: false,  code: 'USERNOTACTIVATED', msg: 'User Acoount is not yet activated. Please activate your account.'
														+ 'If you not received an email.' });
			}
		}
	});
});

router.delete('/deleteUser/:id', (req, res, next) => {
	User.remove({ _id: req.params.id }, function (err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json(result);
		}
	})
});

router.get('/users', (req, res, next) => {
	User.find(function (err, user) {
		if (err) {
			res.json(err);
		} else {
			res.json(user);
		}
	});
});



/* //To protect routing to profile - Comment this if no security is needed: (passport.authenticate('jwt', {session:false}),)
router.get('/profile', passport.authenticate('jwt', {session:false}),(req, res, next) => {
	res.json({user: req.user});
}); */

module.exports = router;