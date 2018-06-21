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
		prescriptionType: req.body.prescriptionType,
		doctorName: req.body.doctorName,
		prescriptionDate: req.body.prescriptionDate,
		prescriptionMessage: req.body.prescriptionMessage,
		prescriptionStatus: req.body.prescriptionStatus
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
		selectPatient: req.body.selectPatient,
		medication: req.body.medication
	});
	prescription.save((err, prescription)=>{
		if(err){
			res.json(err);
			console.log(err);
		}else{
			console.log("Prescription has been created successfully");
			res.json({msg:"Prescription has been created successfully"});
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
