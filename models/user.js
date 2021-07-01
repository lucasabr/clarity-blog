const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const emailer = require('../emailer');

const userSchema = new Schema({
	name: {
		type: String,
		required: false,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	confirmed: {
		type: Boolean,
		required: true,
	},
	setupFinished: {
		type: Boolean,
		required: true,
	},
	private: {
		type: Boolean,
		required: false,
	},
	description: {
		type: String,
		required: false,
	},
});

userSchema.statics.create = function (email, password, confirmed, setup) {
	const user = new this({
		email: email,
		password: password,
		confirmed: confirmed,
		setupFinished: setup,
	});
	console.log(user.id);
	user.save().then(result => emailer.sendEmail(email, user.id));
};

userSchema.statics.setup = function (name, description) {};

userSchema.statics.confirmUser = function (id, cb) {
	this.findOneAndUpdate({ _id: id }, { confirmed: true })
		.then(() => cb(null))
		.catch(err => cb(err));
};

userSchema.statics.isMailUnique = function (email, callback) {
	this.findOne({ email: email }).then(user => {
		if (user) {
			callback(false);
		} else {
			callback(true);
		}
	});
};

userSchema.statics.isNameUnique = function (name, callback) {
	this.findOne({ name: name }).then(user => {
		if (user) {
			callback(false);
		} else {
			callback(true);
		}
	});
};
userSchema.statics.updateAccount = function (email, name, description, private, callback) {
	this.findOneAndUpdate(
		{ email: email },
		{ name: name, private: private, description: description, setupFinished: true },
	)
		.then(() => callback(null))
		.catch(err => callback(err));
};
const User = mongoose.model('User', userSchema);

module.exports = User;
