const mongoose = require('mongoose');

/* Admin Schema */ 
const AdminSchema = mongoose.Schema({
    firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	/*password: {
		type: String
	},
	retypepassword: {
		type: String
	},*/
	contactNumber: {
		type: Number,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	/*address: {
		type: String
	},*/
});

/* Exporting Admin schema for use in other modules */
const Admins = module.exports = mongoose.model('Admins', AdminSchema );

/*Returns list of Admins */
module.exports.getAllAdmins = (callback) => {
    Admins.find(callback);
}

/* Adds new admin into the mongodb database*/
module.exports.addAdmin = (newAdmin, callback) => {
    newAdmin.save(callback);
}

/* Deletes existing admin from the database based on id passed*/
module.exports.deleteAdminById = (id, callback) => {
    let query = {_id: id};
    Admins.remove(query, callback);
}

/*module.exports.findOneAndUpdate = (id, callback) => {
	let query = {_id: id};
    Admins.save(query,callback);
}*/
