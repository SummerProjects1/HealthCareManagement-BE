var express = require('express');
var router = express.Router();

const Prescription = require('../models/prescriptionModel');


router.delete('/deletePrescipt/:id', (req, res, next)=>{
	Prescription.remove({_id: req.params.id},function(err, result){
		if(err){
			res.json(err);
		}else{
			res.json(result);
		}
	})
});

router.put('/editPrescript/:id', (req, res, next)=>{
	console.log('body'+ req.body.prescriptionDate);
	console.log('id'+ req.params.id);
	Prescription.findOneAndUpdate({_id: req.params.id},{
	$set:{
		prescriptionDate:req.body.prescriptionDate,
		prescriptionTime:req.body.prescriptionTime,
		patientFName: req.body.patientFName,
		patientLName: req.body.patientLName,
		patientEmail: req.body.patientEmail,
		doctorFName: req.body.doctorFName,
		doctorLName: req.body.doctorLName,
		doctorEmail: req.body.doctorEmail,
		medication: req.body.medication
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

router.post('/addPrescription', (req, res, next)=>{
	"use strict";
	console.log(req.body);
	let prescription = new Prescription({
		prescriptionDate:req.body.prescriptionDate,
		prescriptionTime:req.body.prescriptionTime,
		patientFName: req.body.patientFName,
		patientLName: req.body.patientLName,
		patientEmail: req.body.patientEmail,
		doctorFName: req.body.doctorFName,
		doctorLName: req.body.doctorLName,
		doctorEmail: req.body.doctorEmail,
		medication: req.body.medication
	});
	prescription.save((err, prescription)=>{
		if(err){
			res.json({success: false, msg:"Something went wrong"});
			console.log(err);
		}else{
			console.log("Prescription has been created successfully");
			res.json({success: true, msg:"Prescription has been created successfully"});
		}
	});
});

router.get('/prescripts', (req, res, next)=>{
	Prescription.find(function(err, prescription){
		if(err){
			res.json(err);
		}else{
			res.json(prescription);
		}
	});
});

module.exports = router;
