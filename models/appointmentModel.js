var mongoose = require('mongoose');
//added by rekhagg
const appointmentSchema = mongoose.Schema({

	appointmentType:{
		type: String,
		required: true
	},
	doctorFName: {
		type: String,
		required: true
	},
	doctorLName: {
		type: String,
		required: false
	},
	appointDate: {
		type: String,
		required: true
	},
	appointTime: {
		type: String,
		required: true
	},
	appointMessage: {
		type: String,
		required: true
	},
	appointStatus: {
		type: String,
		required: true
	},
	doctorEmail:{
		type: String,
		required: true
	},
	patientFName: {
		type: String,
		required: false
	},
	patientLName: {
		type: String,
		required: false
	},
	patientEmail: {
		type: String,
		required: true
	}
});

const Appointment  = module.exports = mongoose.model('Appointment', appointmentSchema);