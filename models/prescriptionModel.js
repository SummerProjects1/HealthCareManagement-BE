var mongoose = require('mongoose');

const prescriptionSchema = mongoose.Schema({

	prescriptionDate:{
		type: String,
		required: true
	},
	prescriptionTime:{
		type: String,
		required: true
	},
	patientFName:{
        type: String,
		required: true
	},
	patientLName:{
        type: String,
		required: true
	},
	patientEmail:{
        type: String,
		required: true
	},
	patientAge:{
		type: String,
		required: true
	},
	patientGender:{
		type: String,
		required: true
	},
	doctorFName:{
        type: String,
		required: true
	},
	doctorLName:{
        type: String,
		required: true
	},
	doctorEmail:{
        type: String,
		required: true
	},
	medication:{
        type: String,
		required: true
	}

});

const Prescription  = module.exports = mongoose.model('Prescription', prescriptionSchema);

/* module.exports.findOneAndUpdate = (id, callback) => {
	let query = {_id: id};
	Prescription.save(query,callback);
} */

/* Deletes existing prescription from the database based on id passed*/
module.exports.deletePrescriptionById = (id, callback) => {
    let query = {_id: id};
    Prescription.remove(query, callback);
}