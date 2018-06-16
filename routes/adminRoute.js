var express = require('express');
var router = express.Router();

const Admin = require('../models/adminModel');

router.delete('/deleteAdmin/:id', (req, res, next)=>{
	Admin.remove({_id: req.params.id},function(err, result){
		if(err){
			res.json(err);
		}else{
			res.json(result);
		}
	})
});

router.put('/editAdmin/:id', (req, res, next)=>{
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
});

router.post('/addAdmin', (req, res, next)=>{
	"use strict";
	console.log(req.body);
	let admin = new Admin({
		userName: req.body.userName,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		password: req.body.password,
        retypepassword: req.body.retypepassword,
		contact: req.body.contact,
		email: req.body.email
	});
	admin.save((err, admin)=>{
		if(err){
			res.json(err);
			console.log(err);
		}else{
			res.json({msg:"Admin added successfully"});
		}
	});
});

router.get('/admins', (req, res, next)=>{
	Admin.find(function(err, admin){
		if(err){
			res.json(err);
		}else{
			res.json(admin);
		}
	});
});

router.get('/adminDetails/:uName', function(req, res) {
    console.log("I received a GET request");
    var name = req.params.uName;
    console.log("Name: " + name);
    Admin.find({ userName: name }, function(err, admin) {
    	if(err){
			res.json(err);
		}else{
			res.json(admin);
		}
    });
});

module.exports = router;