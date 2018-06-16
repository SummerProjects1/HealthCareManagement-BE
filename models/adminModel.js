const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const AdminSchema = mongoose.Schema({

    username: {
		type: String,
		required: true
	},
    firstname:{
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	},
	
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	retypepassword: {
		type: String,
		required: true
    },
    contact: {
		type: String,
		required: true
	}

});

const Admin  = module.exports = mongoose.model('Admin', AdminSchema);

module.exports.getUserById = function(id, callback){
    Admin.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    const query = {username : username}
    Admin.findOne(query, callback);
}

module.exports.addAdmin = function(newAdmin, callback){
	//generates random key that hash the password
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
            if(err) throw err;
            newAdmin.password = hash;
            newAdmin.save(callback);
        });
    });
}

module.exports. comparePassword  = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
}