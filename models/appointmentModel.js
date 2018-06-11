var mongoose = require('mongoose');
//added by rekhagg
const appointmentSchema = mongoose.Schema({

	appointmentType:{
		type: String,
		required: true
	},
	doctorName: {
		type: String,
		required: true
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
	}
});

const Appointment  = module.exports = mongoose.model('Appointment', appointmentSchema);