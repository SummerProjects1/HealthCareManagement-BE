var express = require('express');
var router = express.Router();

const Appointment = require('../models/appointmentModel');

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
	console.log('body'+ req.body.appointDate);
	console.log('id'+ req.params.id);
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
			console.log("Appointment has been created successfully");
			res.json({ status: true, msg:"Appointment has been created successfully"});
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
    console.log("I received a GET request");
    var email = req.params.uEmail;
    console.log("Email: " + email);
    Appointment.find({$or:[{doctorEmail: email},{patientEmail: email}]}, function(err, result) {
    	if(err){
			res.json(err);
		}else{
			res.json(result);
		}
    });
});

module.exports = router;
