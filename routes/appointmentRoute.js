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
		doctorName: req.body.doctorName,
		appointDate: req.body.appointDate,
		appointTime: req.body.appointTime,
		appointMessage: req.body.appointMessage,
		appointStatus: "Open"
	});
	appointment.save((err, appointment)=>{
		if(err){
			res.json(err);
			console.log(err);
		}else{
			console.log("Appointment has been created successfully");
			res.json({msg:"Appointment has been created successfully"});
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

module.exports = router;
