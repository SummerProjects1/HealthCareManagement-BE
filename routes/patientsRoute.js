//Require the express package and use express.Router()
const express = require('express');
const router = express.Router();

const Patient = require('../models/patientsModel');

//GET HTTP method to /patient/getPatient
router.get('/getPatient',(req,res) => {
	//res.send("GET");
	Patient.getAllPatients((err, patients) => {
		if(err) {
			res.json({success: false, message: `Failed to load all patients. Error: ${err}`});
		}
		else {
			res.write(JSON.stringify({success: true, patients:patients}, null, 2));
            res.end();
		}
	});
});

//POST HTTP method to /patient/addPatient
router.post('/addPatient', (req,res,next) => {
	//res.send("POST");
	let newPatient = new Patient({
        firstName: req.body.firstName,
		lastName: req.body.lastName,
		username: req.body.username,
		password: req.body.password,
		dateOfBirth: req.body.dateOfBirth,
		gender: req.body.gender,
		age: req.body.age,
		contactNumber: req.body.contactNumber,
		email: req.body.email,
		address: req.body.address,
		maritalStatus: req.body.maritalStatus,
		img: req.body.img,
		bloodGroup: req.body.bloodGroup,
		bloodPressure: req.body.bloodPressure,
		sugger: req.body.sugger,
		Injury: req.body.Injury
    });
    Patient.addPatient(newPatient,(err, patient) => {
        if(err) {
            res.json({success: false, message: `Failed to add new patient. Error: ${err}`});

        }
        else
            res.json({success:true, message: "Patient added successfully."});

    });
});

//DELETE HTTP method to /patient/deletePatient. Here, we pass in a params which is the object id.
router.delete('/deletePatient/:id', (req,res,next)=> {
	//res.send("DELETE");
	//access the parameter which is the id of the item to be deleted
    let id = req.params.id;
  	//Call the model method deletePatientById
    Patient.deletePatientById(id,(err,list) => {
        if(err) {
            res.json({success:false, message: `Failed to delete the Patient. Error: ${err}`});
        }
        else if(list) {
            res.json({success:true, message: "Patient deleted successfully"});
        }
        else
            res.json({success:false});
    });
});

module.exports = router;