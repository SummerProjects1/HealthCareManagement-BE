//Require mongoose package
const mongoose = require('mongoose');

//Define PatientSchema with necessary fields
const PatientSchema = mongoose.Schema({
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
	dateOfBirth: {
		type: Date
	},
	gender: {
		type: String,
		enum: ["Male", "Female"]
	},
	age: {
		type: Number
	},
	contactNumber: {
		type: Number,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	address: {
		type: String
	},
	maritalStatus: {
		type: String,
		enum: ["Married", "Single"]
	},
	img: {
		data: Buffer,
		contentType: String
	},
	bloodGroup: {
		type: String
	},
	bloodPressure: {
		type: String
	},
	sugger: {
		type: String
	},
	Injury: {
		type: String,
	}
});

const Patients = module.exports = mongoose.model('Patients', PatientSchema );

//Patient.find() returns all the patients
module.exports.getAllPatients = (callback) => {
    Patients.find(callback);
}

module.exports.getpatientByEmail = (email, callback) => {
	console.log(email);
	let query = {"email": email};
	Patients.findOne(query, callback);
}

//newPatient.save is used to insert the document into MongoDB
module.exports.addPatient = (newPatient, callback) => {
    newPatient.save(callback);
}

//Here we need to pass an id parameter to PatientList.remove
module.exports.deletePatientById = (id, callback) => {
    let query = {_id: id};
    Patients.remove(query, callback);
}

module.exports.getPatientNamesByAjax = function(matchingPattern, callback){
	var matchPattern = new RegExp('^'+matchingPattern, "i");
	const query = {$or:[{"firstName": matchPattern},{"lastName": matchPattern}]}; 
	Patients.find(query, callback);
}