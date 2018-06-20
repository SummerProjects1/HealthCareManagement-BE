var express = require('express');
var router = express.Router();

const Doctor = require('../models/doctorsModel');

router.get('/getDoctor',(req,res) => {
	Doctor.getAllDoctors((err, doctors) => {
		if(err) {
			res.json({success: false, message: `Failed to load Doctor. Error: ${err}`});
		}
		else {
			res.write(JSON.stringify({success: true, doctors:doctors}, null, 2));
            res.end();
		}
	});
});

router.post('/addDoctor', (req,res,next) => {
	let newDoctor = new Doctor({
        firstName: req.body.firstName,
		lastName: req.body.lastName,
		username: req.body.username,
		password: req.body.password,
		retypepassword: req.body.retypepassword,
		contactNumber: req.body.contactNumber,
		email: req.body.email,
        address: req.body.address,
        specialization:req.body.specialization,
        department:req.body.department,
        gender:req.body.gender,
        dob:req.body.gender,
    });
    Doctor.addDoctor(newDoctor,(err, doctor) => {
        if(err) {
            res.json({success: false, message: `Failed to add new Doctor. Error: ${err}`});

        }
        else
            res.json({success:true, message: "Doctor added successfully."});

    });
});

router.delete('/deleteDoctor/:id', (req,res,next)=> {
    let id = req.params.id;
    Doctor.deleteDoctorById(id,(err,list) => {
        if(err) {
            res.json({success:false, message: `Failed to delete the Doctor. Error: ${err}`});
        }
        else if(list) {
            res.json({success:true, message: "Doctor deleted successfully"});
        }
        else
            res.json({success:false});
    });
});

module.exports = router;

/*router.put('/editAdmin/:id', (req, res, next)=>{
	Admin.findOneAndUpdate({_id: req.params.id},{
	$set:{
		userName: req.body.userName,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
        password: req.body.password,
        retypepassword: req.body.retypepassword,
		contact: req.body.contact,
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
});*/

