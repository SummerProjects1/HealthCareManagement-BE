const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const UserSchema = mongoose.Schema({

    firstname:{
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	},
	username: {
		type: String,
		unique: true,
		required: true
	},
	email: {
		type: String,
		unique: true,
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
	},
	temporaryToken:{
		type: String,
		required: true
	},
	isActivated:{
		type: Boolean,
		default: false,
		required: true
	},
	userType: {
		type: String,
		default: 'patient',
		required: true
	}

});

const User  = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    const query = {username : username}
    User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
	//generates random key that hash the password
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
			newUser.password = hash;
			newUser.retypepassword = hash;
            newUser.save(callback);
        });
    });
}

module.exports. comparePassword  = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
}