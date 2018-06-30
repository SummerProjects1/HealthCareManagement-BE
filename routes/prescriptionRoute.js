var express = require('express');
var router = express.Router();

const Prescription = require('../models/prescriptionModel');


/* router.delete('/deletePresciption/:id', (req, res, next)=>{
	Prescription.remove({_id: req.params.id},function(err, result){
		if(err){
			res.json(err);
		}else{
			res.json(result);
		}
	})
});
 */

router.delete('/deletePrescription/:id', (req,res,next)=> {
    let id = req.params.id;
    Prescription.deletePrescriptionById(id,(err,list) => {
        if(err) {
            res.json({success:false, message: `Failed to delete the Prescription. Error: ${err}`});
        }
        else if(list) {
            res.json({success:true, message: "Prescription deleted successfully"});
        }
        else
            res.json({success:false});
    });
});


/* router.put('/editPrescript/:id', (req, res, next)=>{
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
 */
router.post('/addPrescription', (req, res, next)=>{
	"use strict";
	console.log(req.body);
	let prescription = new Prescription({
		prescriptionDate:req.body.prescriptionDate,
		prescriptionTime:req.body.prescriptionTime,
		patientFName: req.body.patientFName,
		patientLName: req.body.patientLName,
		patientEmail: req.body.patientEmail,
		patientAge: req.body.patientAge,
		patientGender: req.body.patientGender,
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

/* router.get('/prescripts', (req, res, next)=>{
	Prescription.find(function(err, prescription){
		if(err){
			res.json(err);
		}else{
			res.json(prescription);
		}
	});
}); */

router.get('/prescriptListFilter/:uEmail', function(req, res) {
    console.log("I received a GET request");
    var email = req.params.uEmail;
    console.log("Email: " + email);
    Prescription.find({$or:[{doctorEmail: email},{patientEmail: email}]}, function(err, result) {
    	if(err){
			res.json({success: false, msg: "Something went wrong. Please try again"});
		}else{
			res.json({success: true, prescriptions: result});
		}
    });
});


router.put('/editPrescription/:id', function(req, res, next) {
	console.log("in router module...")
	var query = {
		firstName: req.body.firstName,
		prescriptionDate:  req.body.prescriptionDate,
		prescriptionTime:  req.body.prescriptionTime,
		patientFName:  req.body. patientFName,
		patientLName: req.body.patientLName,
		patientEmail: req.body.patientEmail,
		patientAge: req.body.patientAge,
		patientGender: req.body.patientGender,
		doctorFName: req.body.doctorFName,
		doctorLName: req.body. doctorLName,
		doctorEmail: req.body. doctorEmail,
		medication:  req.body.medication,
	};
	Prescription.findOneAndUpdate({_id:req.params.id}, query, function(err,prescription){
		if(err){
			res.json(err);
		}else{
			res.json(prescription);
		}
	});
});

module.exports = router;
