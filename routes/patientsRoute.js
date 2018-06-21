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

router.get('/patientDetails/:email',(req,res) => {
	var email = req.params.email;
	Patient.getpatientByEmail(email, (err, patient) => {
		if(err) {
			res.json({success: false, message: `Failed to load Patient. Error: ${err}`});
		}
		else {
			res.json({success: true, patient:patient});
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

router.put('/editPatient/:id', (req, res, next)=>{
	Patient.findOneAndUpdate({_id: req.params.id},{
	$set:{
		userName: req.body.userName,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
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