const mongoose = require('mongoose');

/* Doctors Schema */ 
const DoctorSchema = mongoose.Schema({
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
	contactNumber: {
		type: Number,
		required: true
	},
	email: {
		type: String
	},
	address: {
		type: String,
		required: true
    },
    specialization: {
		type: String,
		required: true
    },
    department: {
		type: String,
		required: true
    },
    gender: {
		type: String,
		required: true
    },
    dob: {
		type: String,
		required: true
	},
	img: {
		data: Buffer,
		contentType: String
	},
});

/* Exporting Doctors schema for use in other modules */
const Doctors = module.exports = mongoose.model('Doctors', DoctorSchema );

/*Returns list of Doctors */
module.exports.getAllDoctors = (callback) => {
    Doctors.find(callback);
}

module.exports.getDoctorNamesByAjax = function(matchingPattern, callback){
	var matchPattern = new RegExp('^'+matchingPattern, "i");

	const query = {$or:[{"firstName": matchPattern},{"lastName": matchPattern}]}; 
	Doctors.find(query, callback);
}

/* Adds new Doctor into the mongodb database*/
module.exports.addDoctor = (newDoctor, callback) => {
    newDoctor.save(callback);
}

/* Deletes existing Doctor from the database based on id passed*/
module.exports.deleteDoctorById = (id, callback) => {
    let query = {_id: id};
    Doctors.remove(query, callback);
}
