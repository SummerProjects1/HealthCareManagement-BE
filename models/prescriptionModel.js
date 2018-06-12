var mongoose = require('mongoose');

const prescriptionSchema = mongoose.Schema({

	prescriptionType:{
		type: String,
		required: true
	},
	doctorName: {
		type: String,
		required: true
	},
	prescriptionDate: {
		type: String,
		required: true
	},
	prescriptionMessage: {
		type: String,
		required: true
	},
	prescriptionStatus: {
		type: String,
		required: true
	}
});

const Prescription  = module.exports = mongoose.model('Prescription', prescriptionSchema);