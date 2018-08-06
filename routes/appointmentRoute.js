var express = require('express');
var nodemailer = require('nodemailer');
const config = require('../config/database');
var router = express.Router();

const Appointment = require('../models/appointmentModel');

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

router.delete('/deleteAppointment/:id', (req, res, next)=>{
	Appointment.remove({_id: req.params.id},function(err, result){
		if(err){
			res.json(err);
		}else{
			res.json(result);
		}
	})
});

router.put('/editAppointment/:id', (req, res, next)=>{
	Appointment.findOneAndUpdate({_id: req.params.id},{
	$set:{
		appointmentType: req.body.appointmentType,
		doctorName: req.body.doctorName,
		appointDate: req.body.appointDate,
		appointTime: req.body.appointTime,
		appointMessage: req.body.appointMessage,
		appointStatus: req.body.appointStatus
	}
}, 
function(err, result){
	if(err){
		res.json(err);
	}else{
		res.json(result);
	}
})
});

router.post('/addAppointment', (req, res, next)=>{
	"use strict";
	console.log(req.body);
	console.log(config.mailOptionturnOnOff);
	let appointment = new Appointment({
		appointmentType: req.body.appointmentType,
		doctorFName: req.body.doctorFName,
		doctorLName: req.body.doctorLName,
		doctorEmail: req.body.doctorEmail,
		patientFName: req.body.patientFName,
		patientLName: req.body.patientLName,
		patientEmail: req.body.patientEmail,
		appointDate: req.body.appointDate,
		appointTime: req.body.appointTime,
		appointMessage: req.body.appointMessage,
		appointStatus: "Open"
	});
	appointment.save((err, appointment)=>{
		if(err){
			res.json({ status: false, msg:"Something went wrong while making an appointment. Please try again"});
		}else{
			let helperOptions = {
				from: 'HipCatC Application, hipcatc@localhost.com',
				to: req.body.patientEmail,
				subject: "HipCat C  Appointment management ",
				text: 'Hello ' + req.body.patientFName + '\n\nYour appointment has been scheduled on '+ req.body.appointDate+' at '+req.body.appointTime+'  with Doctor '+ req.body.doctorFName+' !!' +
					'You will receive an another email on confirming your applointment. Please check your appointment status with the following link \n http://localhost:4200/home/'
					+ '\n\n\nRegards,\nHipCatC Team.',
				html: 'Hello <strong>' + req.body.patientFName + '</strong>,<br><br>Your appointment has been scheduled on '+req.body.appointDate+' at '+req.body.appointTime+' with Doctor '+ req.body.doctorFName+' !!<br><br>' +
					'You will receive an another email on confirming your applointment. Please check your appointment status with the following link. <br><a href="http://localhost:4200/home/">http://localhost:4200/home/</a>'
					+ '<br><br><br>Regards,<br>HipCatC Team.'
			};
			if(config.mailOptionturnOnOff){
				transporter.sendMail(helperOptions, (error, info) => {
					if (error) {
						//console.log(error);
						res.json({ success: false, msg: 'Error while sending an email.' });
					} else {
						//console.log(info);
						res.json({ success: true, msg: 'Appointment has been created successfully' });
					}
				});
			}else{
				res.json({ success: true, msg:"Appointment has been created successfully"});
			}
			console.log("Appointment has been created successfully");
			//res.json({ status: true, msg:"Appointment has been created successfully"});
		}
	});
});

router.get('/appointments', (req, res, next)=>{
	Appointment.find(function(err, appointment){
		if(err){
			res.json(err);
		}else{
			res.json(appointment);
		}
	});
});

router.get('/appointmentListFilter/:uEmail', function(req, res) {
    var email = req.params.uEmail;
    Appointment.find({$or:[{doctorEmail: email},{patientEmail: email}]}, function(err, result) {
    	if(err){
			res.json(err);
		}else{
			res.json(result);
		}
    });
});

module.exports = router;
