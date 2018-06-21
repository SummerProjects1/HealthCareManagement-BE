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

	/* prescriptionType:{
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
	} */
});

const Prescription  = module.exports = mongoose.model('Prescription', prescriptionSchema);