var mongoose = require('mongoose');
const patientSchema = mongoose.Schema({
/**/
	userName:{
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	contactNumber: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	}
});

const Patient  = module.exports = mongoose.model('Patient', patientSchema);