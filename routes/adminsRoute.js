var express = require('express');
var router = express.Router();

const Admin = require('../models/adminsModel');

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
		address: req.body.address,
    });
    Admin.addAdmin(newAdmin,(err, admin) => {
        if(err) {
            res.json({success: false, message: `Failed to add new Admin. Error: ${err}`});

        }
        else
            res.json({success:true, message: "Admin added successfully."});

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

