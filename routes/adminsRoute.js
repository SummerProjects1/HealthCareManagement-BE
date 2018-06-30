var express = require('express');
var router = express.Router();

const Admin = require('../models/adminsModel');
const User = require('../models/usersModel');

router.get('/getAdmin',(req,res) => {
	Admin.getAllAdmins((err, admins) => {
		if(err) {
			res.json({success: false, message: `Failed to load Admins. Error: ${err}`});
		}
		else {
			res.write(JSON.stringify({success: true, admins:admins}, null, 2));
            res.end();
		}
	});
});

router.post('/addAdmin', (req,res,next) => {
	let newAdmin = new Admin({
        firstName: req.body.firstName,
		lastName: req.body.lastName,
		username: req.body.username,
		password: req.body.password,
		retypepassword: req.body.retypepassword,
		contactNumber: req.body.contactNumber,
		email: req.body.email,
		//address: req.body.address,
    });
    Admin.addAdmin(newAdmin,(err, admin) => {
        if(err) {
            res.json({success: false, message: `Failed to add new Admin. Error: ${err}`});

        }
        else{
			/* inserting admin to user table*/
			insertAdminToUserTable(admin);
			res.json({success:true, message: "Admin added successfully."});
		}
            

    });
});

router.delete('/deleteAdmin/:id', (req,res,next)=> {
    let id = req.params.id;
    Admin.deleteAdminById(id,(err,list) => {
        if(err) {
            res.json({success:false, message: `Failed to delete the Admin. Error: ${err}`});
        }
        else if(list) {
            res.json({success:true, message: "Admin deleted successfully"});
        }
        else
            res.json({success:false});
    });
});


router.put('/editAdmin/:id', function(req, res, next) {
	var query = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		username: req.body.username,
		password: req.body.password,
		retypepassword: req.body.retypepassword,
		contactNumber: req.body.contactNumber,
		email: req.body.email,
		//address: req.body.address
	};
	Admin.findOneAndUpdate({_id:req.params.id}, query, function(err,admin){
		if(err){
			res.json(err);
		}else{
			res.json(admin);
		}
	});
});

var insertAdminToUserTable = function(admin) {
	let newUserDetails = {
        firstname: admin.firstName,
		lastname: admin.lastName,
		username: admin.username,
		email: admin.email,
		password: admin.password,
		retypepassword: admin.retypepassword,
		contact: admin.contactNumber,
		userType:"admin",
		isActivated: true,
		//temporaryToken = jwt.sign({ username: admin.username, email: admin.email }, secret, { expiresIn: '24h' }), // Create a token for activating account through e-mail
		temporaryToken:"xyz"
	};
	User.create(newUserDetails,(err, user) => {
		if(err) {
			console.log({success: false, message: `Failed to add new Admin. Error: ${err}`});
	
		} 
		else{
			console.log({success:true, message: "Admin added to user table successfully."});
		}
	
	});
    
}

module.exports = router;





