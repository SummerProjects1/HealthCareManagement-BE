var express = require('express');
var router = express.Router();

const Patient = require('../models/patientModel');
//added by rekha
router.delete('/deletePatient/:id', (req, res, next)=>{
	Patient.remove({_id: req.params.id},function(err, result){
		if(err){
			res.json(err);
		}else{
			res.json(result);
		}
	})
});

router.put('/editPatient/:id', (req, res, next)=>{
	console.log('lastName '+ req.body.lastName);
	console.log('userName'+ req.params.userName);
	Patient.findOneAndUpdate({_id: req.params.id},{
	$set:{
		userName: req.body.userName,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		password: req.body.password,
		address: req.body.address,
		contactNumber: req.body.contactNumber,
		email: req.body.email
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

router.post('/addPatient', (req, res, next)=>{
	"use strict";
	console.log(req.body);
	let patient = new Patient({
		userName: req.body.userName,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		password: req.body.password,
		address: req.body.address,
		contactNumber: req.body.contactNumber,
		email: req.body.email
	});
	patient.save((err, patient)=>{
		if(err){
			res.json(err);
			console.log(err);
		}else{
			res.json({msg:"Patient has been inserted successfully"});
		}
	});
});

router.get('/patients', (req, res, next)=>{
	Patient.find(function(err, patient){
		if(err){
			res.json(err);
		}else{
			res.json(patient);
		}
	});
});

router.get('/patientDetails/:uName', function(req, res) {
    console.log("I received a GET request");
    var name = req.params.uName;
    console.log("Name: " + name);
    Patient.find({ userName: name }, function(err, patient) {
    	if(err){
			res.json(err);
		}else{
			res.json(patient);
		}
    });
});

module.exports = router;